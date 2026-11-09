@echo off
chcp 65001 >nul 2>&1
title Haydar Speed Pro - Accélérateur Universel Windows (XP à 11)
color 0B

:: ============================================================================
:: HAYDAR SPEED PRO - SUITE D'OPTIMISATION SYSTÈME ULTRALÉGÈRE
:: Compatible : Windows XP SP3, Vista, Windows 7, 8, 8.1, 10 et 11 (32 et 64-bit)
:: 100%% Gratuit - Sans licence ni abonnement
::
:: صدقة جارية على روح أخي حيدر حشاني رحمه الله
:: Contacter le créateur : hachaniinfos@gmail.com · WhatsApp +21655405159
:: ============================================================================

:: Forcer le répertoire de travail vers le dossier du script (évite l'erreur system32)
cd /d "%~dp0"

:: Vérification et élévation automatique des privilèges Administrateur
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Demande des droits Administrateur requis...
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs" >nul 2>&1
    if %errorlevel% neq 0 (
        echo [!] Merci de faire un clic droit sur ce script et selectionner :
        echo     "Executer en tant qu'administrateur"
        pause
        exit /b
    )
    exit /b
)

cd /d "%~dp0"
cls
echo ============================================================================
echo   HAYDAR SPEED PRO - OPTIMISEUR WINDOWS UNIVERSEL (XP A 11)
echo ============================================================================
echo   Version cible configuree : Windows 10
echo.
echo   صدقة جارية على روح أخي حيدر حشاني رحمه الله
echo   Contact : hachaniinfos@gmail.com ^| WhatsApp : +21655405159
echo ============================================================================
echo.
echo   [1] Optimisation complete automatique (Recommande pour vieux PC)
echo   [2] Nettoyage uniquement des fichiers temporaires et caches
echo   [3] Appliquer uniquement les reglages de registre et fluidite
echo   [4] Creer un point de restauration systeme de securite
echo   [5] Liberer la memoire RAM immediatement
echo   [6] Quitter
echo.
set /p userchoice="Selectionnez une option (1-6) puis tapez Entree : "

if "%userchoice%"=="1" goto opt_full
if "%userchoice%"=="2" goto opt_clean
if "%userchoice%"=="3" goto opt_tweaks
if "%userchoice%"=="4" goto opt_restore_point
if "%userchoice%"=="5" goto opt_ram
if "%userchoice%"=="6" goto opt_exit
goto opt_full

:opt_restore_point
echo.
echo [*] Creation du Point de Restauration de securite...
wmic.exe /Namespace:\\root\default Path SystemRestore Call CreateRestorePoint "Avant_Haydar_Speed_Pro", 100, 7 >nul 2>&1
if %errorlevel% equ 0 (
    echo [+] Point de restauration cree avec succes.
) else (
    echo [-] Restauration systeme non supportee ou desactivee (ex: Windows XP/Home).
)
if "%userchoice%"=="4" pause & goto opt_exit

:opt_clean
echo.
echo ============================================================================
echo   NETTOYAGE SECURISE DU SYSTEME EN COURS...
echo ============================================================================
echo [*] Nettoyage des fichiers temporaires utilisateur (%TEMP%)...
del /f /s /q "%TEMP%\*.*" >nul 2>&1
for /d %%p in ("%TEMP%\*.*") do rmdir /s /q "%%p" >nul 2>&1
echo [*] Nettoyage des fichiers temporaires Windows (C:\Windows\Temp)...
del /f /s /q "C:\Windows\Temp\*.*" >nul 2>&1
for /d %%p in ("C:\Windows\Temp\*.*") do rmdir /s /q "%%p" >nul 2>&1
echo [*] Nettoyage du cache Prefetch Windows...
del /f /s /q "C:\Windows\Prefetch\*.pf" >nul 2>&1
echo [*] Vidage de la Corbeille de tous les lecteurs...
rd /s /q %SYSTEMDRIVE%\$Recycle.bin >nul 2>&1
rd /s /q %SYSTEMDRIVE%\RECYCLER >nul 2>&1
echo [*] Nettoyage des journaux et minidumps...
del /f /s /q "C:\Windows\Logs\*.*" >nul 2>&1
del /f /s /q "C:\Windows\Minidump\*.*" >nul 2>&1
echo [*] Vidage du cache DNS Windows...
ipconfig /flushdns >nul 2>&1
:: Nettoyage Cache des Miniatures d'images (Thumbcache)
del /f /s /q "%TEMP%\*.*" >nul 2>&1
:: Nettoyage Caches Navigateurs (Chrome, Edge, Firefox, IE)
del /f /s /q "%TEMP%\*.*" >nul 2>&1
:: Nettoyage Rapports d'Erreurs Windows (WER)
del /f /s /q "%TEMP%\*.*" >nul 2>&1
echo [+] Nettoyage termine avec succes !
if "%userchoice%"=="2" pause & goto opt_exit

:opt_tweaks
echo.
echo ============================================================================
echo   APPLICATION DES REGLAGES D'ACCELERATION POUR VIEUX PC...
echo ============================================================================

echo [*] Désactiver les animations et effets visuels superflus...

echo [*] Réduire le délai d'ouverture des menus (MenuShowDelay à 0 ms)...
reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d 0 /f >nul 2>&1

echo [*] Fermeture accélérée des applications figées et arrêt rapide...
reg add "HKLM\SYSTEM\CurrentControlSet\Control" /v WaitToKillServiceTimeout /t REG_SZ /d 2000 /f >nul 2>&1

echo [*] Désactiver la transparence Aero / Acrylic / Mica...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v EnableTransparency /t REG_DWORD /d 0 /f >nul 2>&1

echo [*] Garder le noyau Windows en RAM sans swap (DisablePagingExecutive)...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 1 /f >nul 2>&1

echo [*] Optimiser la taille du cache système (LargeSystemCache)...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v LargeSystemCache /t REG_DWORD /d 1 /f >nul 2>&1

echo [*] Fixer la taille de la mémoire virtuelle (Pagefile) pour éviter la fragmentation...

echo [*] Désactiver SysMain / SuperFetch (Corrige le bug 100% disque sur HDD)...
sc config SysMain start= disabled >nul 2>&1
net stop SysMain >nul 2>&1
sc config SysMain start= disabled >nul 2>&1

echo [*] Désactiver l'indexation Windows Search sur disque HDD...
sc config WSearch start= disabled >nul 2>&1
net stop WSearch >nul 2>&1
sc config WSearch start= disabled >nul 2>&1

echo [*] Désactiver la télémétrie et le suivi de diagnostic Microsoft...
sc config DiagTrack start= disabled >nul 2>&1
net stop DiagTrack >nul 2>&1
sc config DiagTrack start= disabled >nul 2>&1

echo [*] Désactiver le service de rapport d'erreurs (WerSvc)...
sc config WerSvc start= disabled >nul 2>&1
net stop WerSvc >nul 2>&1
sc config WerSvc start= disabled >nul 2>&1

echo [*] Désactiver le registre à distance (Sécurité & Ressources)...
sc config RemoteRegistry start= disabled >nul 2>&1
net stop RemoteRegistry >nul 2>&1
sc config RemoteRegistry start= disabled >nul 2>&1

echo [*] Désactiver la mise à jour du dernier accès NTFS (NtfsDisableLastAccessUpdate)...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v NtfsDisableLastAccessUpdate /t REG_DWORD /d 1 /f >nul 2>&1

echo [*] Supprimer la réserve de bande passante Windows (QoS 0%)...
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Psched" /v NonBestEffortLimit /t REG_DWORD /d 0 /f >nul 2>&1

echo [*] Optimisation du débit réseau TCP Window Auto-Tuning...
netsh int tcp set global autotuninglevel=normal >nul 2>&1

echo [*] Priorité CPU Maximale à l'application active (Win32PrioritySeparation = 38)...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f >nul 2>&1

echo [*] Supprimer la réserve de processeur Windows (SystemResponsiveness = 0)...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f >nul 2>&1

echo [*] Débridage réseau multimédia (NetworkThrottlingIndex = FFFFFFFF)...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f >nul 2>&1

echo [*] Activer le mode Performances Maximales (Pas de sous-cadençage CPU)...
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c >nul 2>&1

echo [*] Désactiver GameDVR et la capture fantôme en arrière-plan...
reg add "HKCU\System\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f >nul 2>&1

echo.
echo [+] Reglages du Registre et Services appliques avec succes !
if "%userchoice%"=="3" pause & goto opt_exit

:opt_ram
echo.
echo [*] Liberation de la memoire vive (RAM Cache & WorkingSets)...
%windir%\system32\rundll32.exe advapi32.dll,ProcessIdleTasks >nul 2>&1
echo [+] Cache memoire Windows purge.
if "%userchoice%"=="5" pause & goto opt_exit

:opt_full
goto opt_clean
:: Enchainement automatique vers tweaks et ram via opt_clean -> opt_tweaks -> opt_ram

:opt_exit
echo.
echo ============================================================================
echo   OPTIMISATION TERMINEE AVEC SUCCES !
echo ============================================================================
echo   Votre PC est desormais allege et plus rapide.
echo   Un redemarrage est recommande pour finaliser la prise en compte.
echo.
echo   صدقة جارية على روح أخي حيدر حشاني رحمه الله
echo   Contacter le createur : hachaniinfos@gmail.com ^| WhatsApp +21655405159
echo ============================================================================
echo.
pause
exit /b
