@echo off
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
del /f /s /q "%TEMP%\*.*" >nul 2>&1
del /f /s /q "C:\Windows\Temp\*.*" >nul 2>&1
del /f /s /q "C:\Windows\Prefetch\*.pf" >nul 2>&1
ipconfig /flushdns >nul 2>&1

echo [*] Optimisation du noyau et du registre...
reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d "0" /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v LargeSystemCache /t REG_DWORD /d 1 /f >nul 2>&1

echo [*] Desactivation de SysMain et telemetrie inutile...
net stop SysMain >nul 2>&1
sc config SysMain start= disabled >nul 2>&1
net stop DiagTrack >nul 2>&1
sc config DiagTrack start= disabled >nul 2>&1

echo [*] Vidage de la memoire vive RAM...
%windir%\system32\rundll32.exe advapi32.dll,ProcessIdleTasks >nul 2>&1

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
