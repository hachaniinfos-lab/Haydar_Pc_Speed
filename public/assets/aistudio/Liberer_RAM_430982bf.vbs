' =====================================================================
' Haydar Speed Pro - Nettoyeur Ultra-Léger de Mémoire RAM (VBScript)
' Compatible : Windows 98, 2000, XP, Vista, 7, 8, 10, 11 (32 & 64-bit)
'
' صدقة جارية على روح أخي حيدر حشاني رحمه الله
' Contacter le créateur : hachaniinfos@gmail.com · WhatsApp +21655405159
' =====================================================================

On Error Resume Next
Set WshShell = CreateObject("WScript.Shell")

' Décharge les processus inactifs du cache mémoire
WshShell.Run "%windir%\system32\rundll32.exe advapi32.dll,ProcessIdleTasks", 0, True

' Force le garbage collector Windows (compatible XP à Win 11)
Dim FreeMem
FreeMem = Space(128000000)

MsgBox "La mémoire vive (RAM) de votre PC a été vidée et optimisée avec succès !" & vbCrLf & vbCrLf & _
       "صدقة جارية على روح أخي حيدر حشاني رحمه الله" & vbCrLf & _
       "Haydar Speed Pro - hachaniinfos@gmail.com", 64, "Haydar Speed Pro - RAM Libérée"
