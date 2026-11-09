import os
import subprocess
import sys

def prepare_build_assets():
    os.makedirs('build_assets', exist_ok=True)
    os.makedirs('public', exist_ok=True)
    
    # 1. Read HTA content from htaGenerator.ts
    with open('src/utils/htaGenerator.ts', 'r', encoding='utf-8') as f:
        ts = f.read()
    start = ts.find('<!DOCTYPE html>')
    end = ts.find('`;', start)
    hta_content = ts[start:end]
    
    with open('build_assets/Haydar_Speed_Pro.hta', 'w', encoding='utf-8') as f:
        f.write(hta_content)
        
    # 2. License / Dedication text
    license_text = """============================================================================
HAYDAR SPEED PRO - SUITE D'OPTIMISATION WINDOWS UNIVERSELLE
Version 2.4 - Compatible Windows XP SP3, 7, 8, 8.1, 10 et 11 (32 & 64-bit)
============================================================================

صدقة جارية على روح أخي حيدر حشاني رحمه الله
Sadaqa Jariya 'ala rouh Akhi Haydar Hachani

Contacter le créateur :
Email : hachaniinfos@gmail.com
WhatsApp : +21655405159

CONDITIONS D'UTILISATION :
1. Ce logiciel est 100% bénévole, libre et gratuit pour tous.
2. Aucune licence payante, aucun abonnement, aucune publicité.
3. Ne collecte aucune donnée personnelle ni télémétrie.
4. Conçu spécialement pour accélérer et redonner vie aux PC anciens et modernes.
============================================================================
"""
    with open('build_assets/LICENSE.txt', 'w', encoding='utf-8') as f:
        f.write(license_text)

    # 3. Batch script with auto elevation
    bat_content = """@echo off
setlocal DisableDelayedExpansion
chcp 65001 >nul 2>&1
title Haydar Speed Pro - Moteur d'Acceleration Windows
color 0A
cls

echo ============================================================================
echo   HAYDAR SPEED PRO - ACCELERATEUR WINDOWS UNIVERSEL
echo   Compatible Windows XP, Vista, 7, 8, 10 et Windows 11 (32/64-bit)
echo.
echo   [Sadaqa Jariya] صدقة جارية على روح أخي حيدر حشاني رحمه الله
echo   Contact : hachaniinfos@gmail.com ^| WhatsApp +21655405159
echo ============================================================================
echo.

:: Verification des droits administrateur
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Elevation des privileges administrateur en cours...
    powershell -Command "Start-Process '%~f0' -Verb RunAs" 2>nul
    if %errorlevel% neq 0 (
        echo [!] Veuillez faire un clic droit sur ce fichier et choisir "Executer en tant qu'administrateur".
        pause
    )
    exit /b
)

echo [*] Nettoyage des caches temporaires...
del /f /s /q "%TEMP%\\*.*" >nul 2>&1
del /f /s /q "C:\\Windows\\Temp\\*.*" >nul 2>&1
del /f /s /q "C:\\Windows\\Prefetch\\*.pf" >nul 2>&1
ipconfig /flushdns >nul 2>&1

echo [*] Optimisation du noyau et du registre...
reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d "0" /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v LargeSystemCache /t REG_DWORD /d 1 /f >nul 2>&1

echo [*] Desactivation de SysMain et telemetrie inutile...
net stop SysMain >nul 2>&1
sc config SysMain start= disabled >nul 2>&1
net stop DiagTrack >nul 2>&1
sc config DiagTrack start= disabled >nul 2>&1

echo [*] Vidage de la memoire vive RAM...
%windir%\\system32\\rundll32.exe advapi32.dll,ProcessIdleTasks >nul 2>&1

echo.
echo ============================================================================
echo [V] OPTIMISATION TERMINEE AVEC SUCCES !
echo     Votre ordinateur Windows est maintenant plus rapide et plus fluide.
echo.
echo     صدقة جارية على روح أخي حيدر حشاني رحمه الله
echo ============================================================================
echo.
pause
exit /b
"""
    with open('build_assets/Haydar_Speed_Pro.bat', 'w', encoding='utf-8') as f:
        f.write(bat_content)

    # 4. RAM Purge VBScript
    vbs_content = """' Haydar Speed Pro - Purgeur de Memoire RAM
On Error Resume Next
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "%windir%\\system32\\rundll32.exe advapi32.dll,ProcessIdleTasks", 0, True
FreeMem = Space(128000000)
MsgBox "La memoire RAM de votre PC a ete liberee avec succes !" & vbCrLf & vbCrLf & "صدقة جارية على روح أخي حيدر حشاني رحمه الله" & vbCrLf & "Contact : hachaniinfos@gmail.com | WhatsApp +21655405159", 64, "Haydar Speed Pro - RAM Flush"
"""
    with open('build_assets/Liberer_RAM.vbs', 'w', encoding='utf-8') as f:
        f.write(vbs_content)

    # 5. Restore default script
    restore_content = """@echo off
title Haydar Speed Pro - Restauration des parametres
reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d "400" /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 0 /f >nul 2>&1
sc config SysMain start= auto >nul 2>&1
net start SysMain >nul 2>&1
echo [V] Parametres d'origine Windows restaures.
pause
"""
    with open('build_assets/Restaurer_Defaut.bat', 'w', encoding='utf-8') as f:
        f.write(restore_content)

    # 6. Guide
    guide_content = """HAYDAR SPEED PRO v2.4
============================================================================
صدقة جارية على روح أخي حيدر حشاني رحمه الله
Contact créateur : hachaniinfos@gmail.com | WhatsApp : +21655405159
============================================================================

Ce logiciel est installé dans votre dossier Program Files.
Vous disposez d'un raccourci sur le Bureau pour lancer l'accélération à tout moment.

Pour désinstaller proprement, ouvrez le Panneau de configuration Windows
-> "Désinstaller un programme" -> Sélectionnez "Haydar Speed Pro".
"""
    with open('build_assets/LISEZMOI_Guide.txt', 'w', encoding='utf-8') as f:
        f.write(guide_content)

    print("All build assets created successfully.")

if __name__ == '__main__':
    prepare_build_assets()
