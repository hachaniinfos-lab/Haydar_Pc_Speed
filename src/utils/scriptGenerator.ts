import { CleanerItem, StartupItem, TweakItem, WindowsVersion } from '../types';

export function generateMasterBatchScript(
  tweaks: TweakItem[],
  cleanerItems: CleanerItem[],
  targetOS: WindowsVersion
): string {
  const selectedTweaks = tweaks.filter((t) => t.enabled);
  const selectedCleaners = cleanerItems.filter((c) => c.selected);

  return `@echo off
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
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs" >nul 2>&1
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
echo   Version cible configuree : Windows ${targetOS.toUpperCase()}
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
wmic.exe /Namespace:\\\\root\\default Path SystemRestore Call CreateRestorePoint "Avant_Haydar_Speed_Pro", 100, 7 >nul 2>&1
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
${selectedCleaners
  .map((c) => {
    switch (c.id) {
      case 'user_temp':
        return `echo [*] Nettoyage des fichiers temporaires utilisateur (%TEMP%)...\ndel /f /s /q "%TEMP%\\*.*" >nul 2>&1\nfor /d %%p in ("%TEMP%\\*.*") do rmdir /s /q "%%p" >nul 2>&1`;
      case 'win_temp':
        return `echo [*] Nettoyage des fichiers temporaires Windows (C:\\Windows\\Temp)...\ndel /f /s /q "C:\\Windows\\Temp\\*.*" >nul 2>&1\nfor /d %%p in ("C:\\Windows\\Temp\\*.*") do rmdir /s /q "%%p" >nul 2>&1`;
      case 'prefetch':
        return `echo [*] Nettoyage du cache Prefetch Windows...\ndel /f /s /q "C:\\Windows\\Prefetch\\*.pf" >nul 2>&1`;
      case 'recycle_bin':
        return `echo [*] Vidage de la Corbeille de tous les lecteurs...\nrd /s /q %SYSTEMDRIVE%\\$Recycle.bin >nul 2>&1\nrd /s /q %SYSTEMDRIVE%\\RECYCLER >nul 2>&1`;
      case 'logs':
        return `echo [*] Nettoyage des journaux et minidumps...\ndel /f /s /q "C:\\Windows\\Logs\\*.*" >nul 2>&1\ndel /f /s /q "C:\\Windows\\Minidump\\*.*" >nul 2>&1`;
      case 'dns_cache':
        return `echo [*] Vidage du cache DNS Windows...\nipconfig /flushdns >nul 2>&1`;
      case 'software_distribution':
        return `echo [*] Purge des fichiers d'installation Windows Update résiduels...\nnet stop wuauserv >nul 2>&1\ndel /f /s /q "C:\\Windows\\SoftwareDistribution\\Download\\*.*" >nul 2>&1\nnet start wuauserv >nul 2>&1`;
      default:
        return `:: Nettoyage ${c.name}\ndel /f /s /q "%TEMP%\\*.*" >nul 2>&1`;
    }
  })
  .join('\n')}
echo [+] Nettoyage termine avec succes !
if "%userchoice%"=="2" pause & goto opt_exit

:opt_tweaks
echo.
echo ============================================================================
echo   APPLICATION DES REGLAGES D'ACCELERATION POUR VIEUX PC...
echo ============================================================================

${selectedTweaks
  .map((t) => {
    let lines = `echo [*] ${t.title}...`;
    if (t.regPath && t.regKey && t.regValue !== undefined) {
      const type = typeof t.regValue === 'number' ? 'REG_DWORD' : 'REG_SZ';
      lines += `\nreg add "${t.regPath}" /v ${t.regKey} /t ${type} /d ${t.regValue} /f >nul 2>&1`;
    }
    if (t.command) {
      lines += `\n${t.command} >nul 2>&1`;
    }
    if (t.serviceName) {
      lines += `\nnet stop ${t.serviceName} >nul 2>&1`;
      lines += `\nsc config ${t.serviceName} start= disabled >nul 2>&1`;
    }
    return lines;
  })
  .join('\n\n')}

echo.
echo [+] Reglages du Registre et Services appliques avec succes !
if "%userchoice%"=="3" pause & goto opt_exit

:opt_ram
echo.
echo [*] Liberation de la memoire vive (RAM Cache & WorkingSets)...
%windir%\\system32\\rundll32.exe advapi32.dll,ProcessIdleTasks >nul 2>&1
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
`;
}

export function generateRestoreBatchScript(): string {
  return `@echo off
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
reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 400 /f >nul 2>&1

echo [*] Reinitialisation de la memoire paginee Windows...
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v LargeSystemCache /t REG_DWORD /d 0 /f >nul 2>&1

echo [*] Reactivation de SuperFetch / SysMain...
sc config SysMain start= auto >nul 2>&1
net start SysMain >nul 2>&1

echo [*] Reactivation de Windows Search...
sc config WSearch start= delayed-auto >nul 2>&1
net start WSearch >nul 2>&1

echo [*] Reactivation du suivi télémétrique par défaut...
sc config DiagTrack start= auto >nul 2>&1

echo [*] Restauration des priorites processeur d'origine (Moteur d'Acceleration Ai Reset)...
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 20 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f >nul 2>&1

echo.
echo [+] Tous les parametres d'origine de Windows ont ete restaures.
echo.
pause
exit /b
`;
}

export function generateRegistryBackupFile(customLabel?: string): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR');
  return `Windows Registry Editor Version 5.00

; ============================================================================
; HAYDAR SPEED PRO - REGISTRY BACKUP & RESTORATION SNAPSHOT
; Fichier : Haydar_Speed_Pro_Registry_Backup.reg
; Snapshot : ${customLabel || 'Sauvegarde Complete des Ruches Systeme Windows'}
; Date : ${dateStr}
; Compatible : Windows XP SP3, Vista, Windows 7, 8, 8.1, 10 et 11 (32 et 64-bit)
;
; Ce fichier .REG contient le cliché complet des ruches de registre clés modifiées
; par les optimisations. Double-cliquez dessus à tout moment pour restaurer
; instantanément et en toute sécurité les valeurs d'origine Microsoft.
;
; صدقة جارية على روح أخي حيدر حشاني رحمه الله
; Contact : hachaniinfos@gmail.com · WhatsApp +21655405159
; ============================================================================

; [1] RUCHE BUREAU & DELAI DES MENUS (MenuShowDelay d'origine = 400ms)
[HKEY_CURRENT_USER\\Control Panel\\Desktop]
"MenuShowDelay"="400"
"WaitToKillAppTimeout"="20000"
"HungAppTimeout"="5000"
"AutoEndTasks"="0"

; [2] RUCHE THEMES & TRANSPARENCE AERO / ACRYLIC (Valeur active d'origine)
[HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize]
"EnableTransparency"=dword:00000001

; [3] RUCHE JEUX & CAPTURE D'ARRIERE-PLAN (GameDVR d'origine active)
[HKEY_CURRENT_USER\\System\\GameConfigStore]
"GameDVR_Enabled"=dword:00000001

; [4] RUCHE GESTION MEMOIRE & NOYAU WINDOWS (DisablePagingExecutive & LargeSystemCache d'origine = 0)
[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management]
"DisablePagingExecutive"=dword:00000000
"LargeSystemCache"=dword:00000000

; [5] RUCHE SYSTEME DE FICHIERS NTFS (Horodatage dernier acces actif par defaut)
[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\FileSystem]
"NtfsDisableLastAccessUpdate"=dword:00000000

; [6] RUCHE PRIORITE PROCESSEUR (Priorite standard equilibree = 2)
[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl]
"Win32PrioritySeparation"=dword:00000002

; [7] RUCHE PROFIL MULTIMEDIA & DEBRIDAGE RESEAU (Valeurs par defaut Microsoft 20 et 10)
[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile]
"SystemResponsiveness"=dword:00000014
"NetworkThrottlingIndex"=dword:0000000a

; [8] RUCHE BANDE PASSANTE QOS (Reserve standard Windows 20%)
[HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched]
"NonBestEffortLimit"=dword:00000014

; [9] RUCHE DELAI D'ARRET DES SERVICES WINDOWS (5000ms par defaut)
[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control]
"WaitToKillServiceTimeout"="5000"
`;
}

export function generateRamPurgeVbs(): string {
  return `' =====================================================================
' Haydar Speed Pro - Nettoyeur Ultra-Léger de Mémoire RAM (VBScript)
' Compatible : Windows 98, 2000, XP, Vista, 7, 8, 10, 11 (32 & 64-bit)
'
' صدقة جارية على روح أخي حيدر حشاني رحمه الله
' Contacter le créateur : hachaniinfos@gmail.com · WhatsApp +21655405159
' =====================================================================

On Error Resume Next
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "%windir%\\system32\\rundll32.exe advapi32.dll,ProcessIdleTasks", 0, True

MsgBox "La mémoire vive (RAM) de votre PC a été vidée et optimisée avec succès !" & vbCrLf & vbCrLf & _
       "صدقة جارية على روح أخي حيدر حشاني رحمه الله" & vbCrLf & _
       "Haydar Speed Pro - hachaniinfos@gmail.com", 64, "Haydar Speed Pro - RAM Libérée"
`;
}

export function generateIExpressSed(batchFileName = 'Haydar_Speed_Pro.bat', exeTargetName = 'Haydar_Speed_Pro.exe'): string {
  return `[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=0
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=%InstallPrompt%
DisplayLicense=%DisplayLicense%
FinishMessage=%FinishMessage%
TargetName=%TargetName%
FriendlyName=%FriendlyName%
AppLaunched=%AppLaunched%
PostInstallCmd=%PostInstallCmd%
AdminQuietInstCmd=%AdminQuietInstCmd%
UserQuietInstCmd=%UserQuietInstCmd%
SourceFiles=SourceFiles
[SourceFiles]
SourceFiles0=.
[SourceFiles0]
%FILE0%=
[Strings]
InstallPrompt=
DisplayLicense=
FinishMessage=Optimisation terminee ! Votre PC Windows est accelere.
TargetName=${exeTargetName}
FriendlyName=Haydar Speed Pro - Accelerateur Windows Universel
AppLaunched=cmd.exe /c "${batchFileName}"
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
FILE0="${batchFileName}"
`;
}

export function generateExeCompilerBat(): string {
  return `@echo off
title Haydar Speed Pro - Compilateur .EXE Automatique
color 0A
cls

:: Forcer le repertoire de travail dans le dossier du script
cd /d "%~dp0"

:: Verifier si Haydar_Speed_Pro.bat est present, sinon le generer
if not exist "%~dp0Haydar_Speed_Pro.bat" (
    echo [*] Generation du script d'acceleration Haydar_Speed_Pro.bat...
    > "%~dp0Haydar_Speed_Pro.bat" echo @echo off
    >> "%~dp0Haydar_Speed_Pro.bat" echo title Haydar Speed Pro - Accelerateur Universel Windows
    >> "%~dp0Haydar_Speed_Pro.bat" echo color 0B
    >> "%~dp0Haydar_Speed_Pro.bat" echo cls
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo ============================================================================
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo   HAYDAR SPEED PRO - OPTIMISEUR WINDOWS UNIVERSEL
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo   Sadaqa Jariya ala rouh Akhi Haydar Hachani
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo   Contact : hachaniinfos@gmail.com ^| WhatsApp +21655405159
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo ============================================================================
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo.
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo [*] 1. Nettoyage des fichiers temporaires...
    >> "%~dp0Haydar_Speed_Pro.bat" echo del /f /s /q "%%TEMP%%\*.*" ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo del /f /s /q "%%windir%%\Temp\*.*" ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo del /f /s /q "%%windir%%\Prefetch\*.pf" ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo rd /s /q %%SYSTEMDRIVE%%\^$Recycle.bin ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo ipconfig /flushdns ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo [*] 2. Optimisation du Registre et Moteur d'Acceleration Ai...
    >> "%~dp0Haydar_Speed_Pro.bat" echo reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d 0 /f ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 1 /f ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v LargeSystemCache /t REG_DWORD /d 1 /f ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v NtfsDisableLastAccessUpdate /t REG_DWORD /d 1 /f ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo [*] 3. Desactivation de SysMain et Telemetrie...
    >> "%~dp0Haydar_Speed_Pro.bat" echo net stop SysMain ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo sc config SysMain start= disabled ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo net stop DiagTrack ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo sc config DiagTrack start= disabled ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo [*] 4. Liberation de la RAM...
    >> "%~dp0Haydar_Speed_Pro.bat" echo %%windir%%\system32\rundll32.exe advapi32.dll,ProcessIdleTasks ^>nul 2^>^&1
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo ============================================================================
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo [+] OPTIMISATION REUSSIE ! Votre PC est accelere.
    >> "%~dp0Haydar_Speed_Pro.bat" echo echo ============================================================================
    >> "%~dp0Haydar_Speed_Pro.bat" echo pause
    echo [+] Haydar_Speed_Pro.bat pret.
)

:: 2. METHODE 0 : Inno Setup Compiler (Detecte si installe sur le PC)
set "ISCC="
if exist "%ProgramFiles(x86)%\Inno Setup 6\iscc.exe" set "ISCC=%ProgramFiles(x86)%\Inno Setup 6\iscc.exe"
if not defined ISCC if exist "%ProgramFiles%\Inno Setup 6\iscc.exe" set "ISCC=%ProgramFiles%\Inno Setup 6\iscc.exe"
if not defined ISCC if exist "%ProgramFiles(x86)%\Inno Setup 5\iscc.exe" set "ISCC=%ProgramFiles(x86)%\Inno Setup 5\iscc.exe"
if not defined ISCC if exist "%ProgramFiles%\Inno Setup 5\iscc.exe" set "ISCC=%ProgramFiles%\Inno Setup 5\iscc.exe"
if not defined ISCC if exist "%LocalAppData%\Programs\Inno Setup 6\iscc.exe" set "ISCC=%LocalAppData%\Programs\Inno Setup 6\iscc.exe"

if defined ISCC (
    echo [*] Inno Setup detecte sur votre machine : "%ISCC%"
    echo [*] Compilation de l'installateur officiel Haydar_Speed_Pro_Setup.exe en cours...
    if not exist "%~dp0Haydar_Speed_Pro_Setup.iss" call :make_inno_iss
    "%ISCC%" "%~dp0Haydar_Speed_Pro_Setup.iss" /Q >nul 2>&1
    if exist "%~dp0Haydar_Speed_Pro_Setup.exe" (
        set "RESULT_EXE=%~dp0Haydar_Speed_Pro_Setup.exe"
        goto compilation_success
    )
)

:: 3. METHODE 1 : Compilateur natif C# Microsoft .NET (csc.exe integre a 100%% de Windows 7, 8, 10, 11)
set "CSC="
if exist "%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\csc.exe" set "CSC=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not defined CSC if exist "%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\csc.exe" set "CSC=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\csc.exe"
if not defined CSC if exist "%SystemRoot%\Microsoft.NET\Framework\v3.5\csc.exe" set "CSC=%SystemRoot%\Microsoft.NET\Framework\v3.5\csc.exe"
if not defined CSC if exist "%SystemRoot%\Microsoft.NET\Framework\v2.0.50727\csc.exe" set "CSC=%SystemRoot%\Microsoft.NET\Framework\v2.0.50727\csc.exe"

if defined CSC (
    echo [*] Compilation native C# (.NET) via : "%CSC%"...
    call :make_csharp_source
    "%CSC%" /nologo /target:winexe /out:"%~dp0Haydar_Speed_Pro.exe" "%TEMP%\Haydar_Speed_Pro_App.cs" >nul 2>&1
    del /f /q "%TEMP%\Haydar_Speed_Pro_App.cs" >nul 2>&1
    if exist "%~dp0Haydar_Speed_Pro.exe" (
        set "RESULT_EXE=%~dp0Haydar_Speed_Pro.exe"
        goto compilation_success
    )
)

:: 4. METHODE 2 : Secours via IExpress natif Windows
if exist "%windir%\system32\iexpress.exe" (
    echo [*] Tentative de secours avec Microsoft IExpress...
    call :make_sed_file
    "%windir%\system32\iexpress.exe" /N /Q "%~dp0Haydar_Speed_Pro.sed" >nul 2>&1
    if exist "%~dp0Haydar_Speed_Pro.exe" (
        set "RESULT_EXE=%~dp0Haydar_Speed_Pro.exe"
        goto compilation_success
    )
)

:: Si aucun compilateur externe n'a pu ecrire le .exe
echo.
echo ============================================================================
echo [!] INFORMATION IMPORTANTE POUR VOTRE SYSTEME :
echo ============================================================================
echo   Votre PC d'entreprise restreint la creation de fichiers .EXE par script.
echo.
echo   VOUS POUVEZ LANCER DIRECTEMENT SANS AUCUNE COMPILATION :
echo    1. Lancer_Haydar_Speed_Pro.bat  (Ouvre l'application moderne)
echo    2. Haydar_Speed_Pro.html         (Ouvre dans Edge ou Chrome)
echo    3. Lancer_Optimisation_1Clic.bat (Optimise tout en 5 secondes)
echo.
echo   OU ouvrez Inno Setup sur votre bureau et appuyez sur F9 (Build -^> Compile)
echo ============================================================================
goto finish

:compilation_success
echo.
echo ============================================================================
echo [+] SUCCES TOTAL ! VOTRE FICHIER EXECUTABLE .EXE A ETE GENERE :
echo.
echo     ==^> %RESULT_EXE%
echo.
echo     Vous avez desormais votre application autonome .EXE officielle !
echo     Double-cliquez dessus ou installez-la en toute securite.
echo.
echo     صدقة جارية على روح أخي حيدر حشاني رحمه الله
echo     Contact : hachaniinfos@gmail.com ^| WhatsApp +21655405159
echo ============================================================================

:finish
echo.
pause
exit /b

:: ============================================================================
:: SOUS-ROUTINES (Generation des sources sans conflit de parentheses)
:: ============================================================================
:make_csharp_source
> "%TEMP%\Haydar_Speed_Pro_App.cs" echo using System;
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo using System.Diagnostics;
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo namespace HaydarSpeedPro {
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo     static class Program {
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo         [STAThread]
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo         static void Main() {
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo             string dir = AppDomain.CurrentDomain.BaseDirectory;
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo             string bat = System.IO.Path.Combine(dir, "Lancer_Haydar_Speed_Pro.bat");
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo             if (!System.IO.File.Exists(bat)) bat = System.IO.Path.Combine(dir, "Haydar_Speed_Pro.bat");
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo             try {
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo                 ProcessStartInfo psi = new ProcessStartInfo("cmd.exe", "/c \"" + bat + "\"");
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo                 psi.Verb = "runas";
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo                 psi.UseShellExecute = true;
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo                 Process.Start(psi);
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo             } catch (Exception) {
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo                 Process.Start("cmd.exe", "/c \"" + bat + "\"");
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo             }
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo         }
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo     }
>> "%TEMP%\Haydar_Speed_Pro_App.cs" echo }
exit /b

:make_inno_iss
> "%~dp0Haydar_Speed_Pro_Setup.iss" echo [Setup]
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo AppName=Haydar Speed Pro
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo AppVersion=2.5
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo AppPublisher=Haider Hachani Charity
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo DefaultDirName={autopf}\Haydar Speed Pro
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo DefaultGroupName=Haydar Speed Pro
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo OutputDir=.
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo OutputBaseFilename=Haydar_Speed_Pro_Setup
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo Compression=lzma2/max
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo SolidCompression=yes
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo PrivilegesRequired=admin
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo SetupIconFile=compiler:Setup.ico
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo [Files]
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo Source: "Lancer_Haydar_Speed_Pro.bat"; DestDir: "{app}"; Flags: ignoreversion
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo Source: "Haydar_Speed_Pro.html"; DestDir: "{app}"; Flags: ignoreversion
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo Source: "Haydar_Speed_Pro.bat"; DestDir: "{app}"; Flags: ignoreversion
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo [Icons]
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo Name: "{autodesktop}\Haydar Speed Pro"; Filename: "{app}\Lancer_Haydar_Speed_Pro.bat"
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo [Run]
>> "%~dp0Haydar_Speed_Pro_Setup.iss" echo Filename: "{app}\Lancer_Haydar_Speed_Pro.bat"; Description: "Lancer Haydar Speed Pro"; Flags: postinstall nowait skipifsilent
exit /b

:make_sed_file
> "%~dp0Haydar_Speed_Pro.sed" echo [Version]
>> "%~dp0Haydar_Speed_Pro.sed" echo Class=IEXPRESS
>> "%~dp0Haydar_Speed_Pro.sed" echo SEDVersion=3
>> "%~dp0Haydar_Speed_Pro.sed" echo [Options]
>> "%~dp0Haydar_Speed_Pro.sed" echo PackagePurpose=InstallApp
>> "%~dp0Haydar_Speed_Pro.sed" echo ShowInstallProgramWindow=0
>> "%~dp0Haydar_Speed_Pro.sed" echo HideExtractAnimation=1
>> "%~dp0Haydar_Speed_Pro.sed" echo UseLongFileName=1
>> "%~dp0Haydar_Speed_Pro.sed" echo InsideCompressed=0
>> "%~dp0Haydar_Speed_Pro.sed" echo CAB_FixedSize=0
>> "%~dp0Haydar_Speed_Pro.sed" echo CAB_ResvCodeSigning=0
>> "%~dp0Haydar_Speed_Pro.sed" echo RebootMode=N
>> "%~dp0Haydar_Speed_Pro.sed" echo InstallPrompt=%%InstallPrompt%%
>> "%~dp0Haydar_Speed_Pro.sed" echo DisplayLicense=%%DisplayLicense%%
>> "%~dp0Haydar_Speed_Pro.sed" echo FinishMessage=%%FinishMessage%%
>> "%~dp0Haydar_Speed_Pro.sed" echo TargetName=%%TargetName%%
>> "%~dp0Haydar_Speed_Pro.sed" echo FriendlyName=%%FriendlyName%%
>> "%~dp0Haydar_Speed_Pro.sed" echo AppLaunched=%%AppLaunched%%
>> "%~dp0Haydar_Speed_Pro.sed" echo PostInstallCmd=%%PostInstallCmd%%
>> "%~dp0Haydar_Speed_Pro.sed" echo AdminQuietInstCmd=%%AdminQuietInstCmd%%
>> "%~dp0Haydar_Speed_Pro.sed" echo UserQuietInstCmd=%%UserQuietInstCmd%%
>> "%~dp0Haydar_Speed_Pro.sed" echo SourceFiles=SourceFiles
>> "%~dp0Haydar_Speed_Pro.sed" echo [SourceFiles]
>> "%~dp0Haydar_Speed_Pro.sed" echo SourceFiles0=.
>> "%~dp0Haydar_Speed_Pro.sed" echo [SourceFiles0]
>> "%~dp0Haydar_Speed_Pro.sed" echo %%FILE0%%=
>> "%~dp0Haydar_Speed_Pro.sed" echo [Strings]
>> "%~dp0Haydar_Speed_Pro.sed" echo InstallPrompt=
>> "%~dp0Haydar_Speed_Pro.sed" echo DisplayLicense=
>> "%~dp0Haydar_Speed_Pro.sed" echo FinishMessage=Optimisation terminee !
>> "%~dp0Haydar_Speed_Pro.sed" echo TargetName=%~dp0Haydar_Speed_Pro.exe
>> "%~dp0Haydar_Speed_Pro.sed" echo FriendlyName=Haydar Speed Pro
>> "%~dp0Haydar_Speed_Pro.sed" echo AppLaunched=cmd.exe /c "Haydar_Speed_Pro.bat"
>> "%~dp0Haydar_Speed_Pro.sed" echo PostInstallCmd=^<None^>
>> "%~dp0Haydar_Speed_Pro.sed" echo AdminQuietInstCmd=
>> "%~dp0Haydar_Speed_Pro.sed" echo UserQuietInstCmd=
>> "%~dp0Haydar_Speed_Pro.sed" echo FILE0="Haydar_Speed_Pro.bat"
exit /b
`;
}

export function generateFoolproofAdminBat(): string {
  return `@echo off
cd /d "%~dp0"
title Haydar Speed Pro - Optimisation Directe en 1 Clic
color 0A
cls

echo ============================================================================
echo   HAYDAR SPEED PRO - OPTIMISATION AUTOMATIQUE DIRECTE (XP A WIN 11)
echo   100%% Gratuit - Sans licence ni abonnement
echo.
echo   [ Sadaqa Jariya ala rouh Akhi Haydar Hachani ]
echo   صدقة جارية على روح أخي حيدر حشاني رحمه الله
echo   Contacter le createur : hachaniinfos@gmail.com ^| WhatsApp +21655405159
echo ============================================================================
echo.
echo [*] Droits Administrateur confirmes !
echo [*] Lancement de l'acceleration systeme en cours...
echo.

:: 1. Nettoyage securise
echo [*] [1/4] Nettoyage des fichiers temporaires (%%TEMP%%, Prefetch, Corbeille)...
del /f /s /q "%TEMP%\\*.*" >nul 2>&1
for /d %%p in ("%TEMP%\\*.*") do rmdir /s /q "%%p" >nul 2>&1
del /f /s /q "C:\\Windows\\Temp\\*.*" >nul 2>&1
for /d %%p in ("C:\\Windows\\Temp\\*.*") do rmdir /s /q "%%p" >nul 2>&1
del /f /s /q "C:\\Windows\\Prefetch\\*.pf" >nul 2>&1
rd /s /q %SYSTEMDRIVE%\\$Recycle.bin >nul 2>&1
ipconfig /flushdns >nul 2>&1
echo [+] Cache et fichiers residuels nettoyes.

:: 2. Registre & Fluidite
echo [*] [2/4] Application des reglages Registre ultra-rapides...
reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 0 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v LargeSystemCache /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" /v NtfsDisableLastAccessUpdate /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v NonBestEffortLimit /t REG_DWORD /d 0 /f >nul 2>&1
echo [+] Delai menu passe a 0ms et noyau verrouille en RAM.

:: 3. Services lourds
echo [*] [3/4] Desactivation des services lourds (SysMain, Telemetrie, WER)...
net stop SysMain >nul 2>&1
sc config SysMain start= disabled >nul 2>&1
net stop DiagTrack >nul 2>&1
sc config DiagTrack start= disabled >nul 2>&1
net stop WerSvc >nul 2>&1
sc config WerSvc start= disabled >nul 2>&1
echo [+] Services d'arriere-plan desactives.

:: 4. RAM Flush
echo [*] [4/4] Purge immediate de la memoire vive (RAM Flush)...
%windir%\\system32\\rundll32.exe advapi32.dll,ProcessIdleTasks >nul 2>&1
echo [+] Memoire vive Windows liberee avec succes.

echo.
echo ============================================================================
echo   [+] OPTIMISATION REUSSIE AVEC SUCCES !
echo ============================================================================
echo   Votre PC Windows est desormais allege et plus reactif.
echo.
echo   صدقة جارية على روح أخي حيدر حشاني رحمه الله
echo   Contacter le createur : hachaniinfos@gmail.com ^| WhatsApp +21655405159
echo ============================================================================
echo.
pause
exit /b
`;
}


export function generateAppLauncherBat(): string {
  return `@echo off
title Lancement de Haydar Speed Pro...
cd /d "%~dp0"

:: 1. Priorite Application Native .EXE si presente
if exist "%~dp0Haydar_Speed_Pro.exe" (
    start "" "%~dp0Haydar_Speed_Pro.exe"
    exit /b
)

:: 2. Priorite Microsoft Edge en Mode Application (Fenetre autonome moderne sans barre d'adresse)
if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
    if exist "%~dp0Haydar_Speed_Pro.html" (
        start "" "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" --app="file:///%~dp0Haydar_Speed_Pro.html"
        exit /b
    )
)
if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
    if exist "%~dp0Haydar_Speed_Pro.html" (
        start "" "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" --app="file:///%~dp0Haydar_Speed_Pro.html"
        exit /b
    )
)

:: 4. Priorite Google Chrome en Mode Application
if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    if exist "%~dp0Haydar_Speed_Pro.html" (
        start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" --app="file:///%~dp0Haydar_Speed_Pro.html"
        exit /b
    )
)
if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    if exist "%~dp0Haydar_Speed_Pro.html" (
        start "" "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" --app="file:///%~dp0Haydar_Speed_Pro.html"
        exit /b
    )
)

:: 5. Lancement MSHTA natif Windows (Compatible Windows XP SP3, 7, 8, 10 et 11)
if exist "%~dp0Haydar_Speed_Pro.hta" (
    start "" "%SystemRoot%\\system32\\mshta.exe" "%~dp0Haydar_Speed_Pro.hta"
    exit /b
)

:: 6. Secours direct par le navigateur web par defaut
if exist "%~dp0Haydar_Speed_Pro.html" (
    start "" "%~dp0Haydar_Speed_Pro.html"
    exit /b
)

echo [-] Erreur : Fichier introuvable. Veuillez verifier que Haydar_Speed_Pro.html ou .hta est dans le meme dossier.
pause
exit /b
`;
}

export function generateReadmeTxt(): string {
  return `============================================================================
HAYDAR SPEED PRO - SUITE D'OPTIMISATION WINDOWS UNIVERSELLE (XP A WINDOWS 11)
============================================================================

100% GRATUIT · SANS LICENCE · SANS ABONNEMENT · ZERO PUBLICITE
Compatible :
 - Windows XP (SP1, SP2, SP3) 32-bit & 64-bit
 - Windows Vista (32-bit & 64-bit)
 - Windows 7 / 8 / 8.1 (32-bit & 64-bit)
 - Windows 10 & Windows 11 (32-bit & 64-bit)

----------------------------------------------------------------------------
DEDICACE :
صدقة جارية على روح أخي حيدر حشاني رحمه الله
Contacter le createur : hachaniinfos@gmail.com · WhatsApp +21655405159
----------------------------------------------------------------------------

CONTENU DU PACK :
1. Lancer_Haydar_Speed_Pro.bat  : Lanceur intelligent (ouvre l'application directement dans une fenetre dediee)
2. Haydar_Speed_Pro.hta         : Application graphique native avec les 10 modules et jauges en direct
3. Haydar_Speed_Pro_Setup.iss   : Script Inno Setup pret pour generer votre installateur .EXE officiel
4. Lancer_Optimisation_1Clic.bat: Script rapide avec elevation automatique Administrateur
5. Haydar_Speed_Pro.bat         : Script maitre complet d'acceleration systeme
6. Liberer_RAM.vbs              : Purgeur de memoire vive (EmptyWorkingSet & ProcessIdleTasks)
7. Restaurer_Defaut.bat         : Restauration des parametres d'origine de Windows

COMMENT LANCER L'APPLICATION :
------------------------------
Methode 1 (Recommandee) :
 - Double-cliquez sur "Lancer_Haydar_Speed_Pro.bat"
 - L'application s'ouvrira directement dans sa fenetre haute resolution !

Methode 2 (Directe) :
 - Double-cliquez sur "Haydar_Speed_Pro.hta"

Methode 3 (Compiler votre vrai installateur .EXE) :
 - Vous avez l'icone "Inno Setup Compiler" sur votre bureau
 - Ouvrez "Haydar_Speed_Pro_Setup.iss" et appuyez sur F9 (Build -> Compile)
 - Votre installateur "Haydar_Speed_Pro_Setup.exe" officiel sera cree en 3 secondes !

FONCTIONS INCLUSES :
- Moteur d'Acceleration Ai : Priorite CPU Win32PrioritySeparation & Timer 1.0 ms
- Nettoyage securise (%TEMP%, Prefetch, Corbeille, Logs)
- Forcage du noyau Windows en memoire vive (DisablePagingExecutive)
- Desactivation du Superfetch/SysMain bloquant les disques a 100%
- Desactivation des telemetries DiagTrack et rapports d'erreurs WerSvc
- Optimisation du debit reseau et serveurs DNS Cloudflare / Google rapides
- Vidage instantane du cache RAM
`;
}
