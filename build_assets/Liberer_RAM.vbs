' Haydar Speed Pro - Purgeur de Memoire RAM
On Error Resume Next
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "%windir%\system32\rundll32.exe advapi32.dll,ProcessIdleTasks", 0, True
FreeMem = Space(128000000)
MsgBox "La memoire RAM de votre PC a ete liberee avec succes !" & vbCrLf & vbCrLf & "صدقة جارية على روح أخي حيدر حشاني رحمه الله" & vbCrLf & "Contact : hachaniinfos@gmail.com | WhatsApp +21655405159", 64, "Haydar Speed Pro - RAM Flush"
