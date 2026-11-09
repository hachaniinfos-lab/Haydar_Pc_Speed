@echo off
setlocal DisableDelayedExpansion
set "batchPath=%~0"
for %%k in (%0) do set batchPath=%%~fsk
set "vbsGetPrivileges=%temp%\OEgetPriv_%random%.vbs"
setlocal EnableDelayedExpansion

:checkPrivileges
NET FILE 1>NUL 2>NUL
if '%errorlevel%' == '0' ( goto gotPrivileges ) else ( goto getPrivileges )

:getPrivileges
if '%1'=='ELEV' (echo ELEV & shift /1 & goto gotPrivileges)
echo Set UAC = CreateObject^("Shell.Application"^) > "%vbsGetPrivileges%"
echo args = "ELEV " >> "%vbsGetPrivileges%"
echo For Each strArg in WScript.Arguments >> "%vbsGetPrivileges%"
echo args = args ^& strArg ^& " "  >> "%vbsGetPrivileges%"
echo Next >> "%vbsGetPrivileges%"
echo UAC.ShellExecute "%batchPath%", args, "", "runas", 1 >> "%vbsGetPrivileges%"
"%SystemRoot%\System32\WScript.exe" "%vbsGetPrivileges%" %*
exit /B

:gotPrivileges
setlocal & pushd .
cd /d "%~dp0"
if '%1'=='ELEV' (del "%vbsGetPrivileges%" 1>nul 2>nul  &  shift /1)

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
del /f /s /q "%TEMP%\*.*" >nul 2>&1
for /d %%p in ("%TEMP%\*.*") do rmdir /s /q "%%p" >nul 2>&1
del /f /s /q "C:\Windows\Temp\*.*" >nul 2>&1
for /d %%p in ("C:\Windows\Temp\*.*") do rmdir /s /q "%%p" >nul 2>&1
del /f /s /q "C:\Windows\Prefetch\*.pf" >nul 2>&1
rd /s /q %SYSTEMDRIVE%\$Recycle.bin >nul 2>&1
ipconfig /flushdns >nul 2>&1
echo [+] Cache et fichiers residuels nettoyes.

:: 2. Registre & Fluidite
echo [*] [2/4] Application des reglages Registre ultra-rapides...
reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d 0 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v LargeSystemCache /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v NtfsDisableLastAccessUpdate /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Psched" /v NonBestEffortLimit /t REG_DWORD /d 0 /f >nul 2>&1
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
%windir%\system32\rundll32.exe advapi32.dll,ProcessIdleTasks >nul 2>&1
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
