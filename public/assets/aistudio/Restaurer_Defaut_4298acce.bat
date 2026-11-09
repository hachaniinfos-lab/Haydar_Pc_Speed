@echo off
chcp 65001 >nul 2>&1
title Haydar Speed Pro - Restauration des parametres par defaut
color 0F

:: ============================================================================
:: RESTAURATION DES PARAMÈTRES PAR DÉFAUT DE WINDOWS
:: صدقة جارية على روح أخي حيدر حشاني رحمه الله
:: Contacter le créateur : hachaniinfos@gmail.com · WhatsApp +21655405159
:: ============================================================================

cd /d "%~dp0"

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Merci de faire un clic droit et "Executer en tant qu'administrateur"
    pause
    exit /b
)

cd /d "%~dp0"

echo [*] Restauration du delai des menus a 400ms...
reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d 400 /f >nul 2>&1

echo [*] Reinitialisation de la memoire paginee Windows...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v LargeSystemCache /t REG_DWORD /d 0 /f >nul 2>&1

echo [*] Reactivation de SuperFetch / SysMain...
sc config SysMain start= auto >nul 2>&1
net start SysMain >nul 2>&1

echo [*] Reactivation de Windows Search...
sc config WSearch start= delayed-auto >nul 2>&1
net start WSearch >nul 2>&1

echo [*] Reactivation du suivi télémétrique par défaut...
sc config DiagTrack start= auto >nul 2>&1

echo [*] Restauration des priorites processeur d'origine (SpeederXP Reset)...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 20 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f >nul 2>&1

echo.
echo [+] Tous les parametres d'origine de Windows ont ete restaures.
echo.
pause
exit /b
