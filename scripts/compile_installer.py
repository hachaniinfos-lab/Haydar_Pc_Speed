import os
import sys
from build_pe import build_pe_executable

def main():
    with open('src/utils/htaGenerator.ts', 'r', encoding='utf-8') as f:
        ts_code = f.read()

    start = ts_code.find('<!DOCTYPE html>')
    end = ts_code.find('`;', start)
    if start == -1 or end == -1:
        print("Error: Could not locate HTA payload in htaGenerator.ts")
        sys.exit(1)
        
    hta_content = ts_code[start:end]
    payload = hta_content.encode('utf-8')
    print(f"HTA Payload size: {len(payload)} bytes")

    output_exe = 'public/Haydar_Speed_Pro_Setup.exe'
    file_size = build_pe_executable(payload, output_exe)
    print(f"Success! {output_exe} generated with size {file_size} bytes.")

if __name__ == '__main__':
    main()
