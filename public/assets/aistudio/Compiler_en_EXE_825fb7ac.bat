@echo off
title Haydar Speed Pro - Compilateur .EXE Automatique
color 0A
cls

:: Forcer le repertoire de travail dans le dossier du script
cd /d "%~dp0"

echo ============================================================================
echo   COMPILATEUR AUTOMATIQUE HAYDAR SPEED PRO EN VRAI FICHIER .EXE
echo   Compatible : Windows XP jusqu'a Windows 11 (32 et 64-bit)
echo.
echo   [ Sadaqa Jariya ala rouh Akhi Haydar Hachani ]
echo   Contacter le createur : hachaniinfos@gmail.com ^| WhatsApp +21655405159
echo ============================================================================
echo.

:: 1. Verifier si Haydar_Speed_Pro.bat est present, sinon le generer
if not exist "%~dp0Haydar_Speed_Pro.bat" (
    echo [*] Generation de Haydar_Speed_Pro.bat...
    (
        echo @echo off
        echo title Haydar Speed Pro - Accelerateur Universel Windows
        echo color 0B
        echo cls
        echo echo ============================================================================
        echo echo   HAYDAR SPEED PRO - OPTIMISEUR WINDOWS UNIVERSEL
        echo echo   Sadaqa Jariya ala rouh Akhi Haydar Hachani
        echo echo   Contact : hachaniinfos@gmail.com ^| WhatsApp +21655405159
        echo echo ============================================================================
        echo echo.
        echo echo [*] 1. Nettoyage des fichiers temporaires (TEMP, Prefetch, Corbeille^)...
        echo del /f /s /q "%%TEMP%%*.*" ^>nul 2^>^&1
        echo del /f /s /q "%%windir%%Temp*.*" ^>nul 2^>^&1
        echo del /f /s /q "%%windir%%Prefetch*.pf" ^>nul 2^>^&1
        echo rd /s /q %%SYSTEMDRIVE%%\$Recycle.bin ^>nul 2^>^&1
        echo ipconfig /flushdns ^>nul 2^>^&1
        echo echo.
        echo echo [*] 2. Optimisation du Registre (MenuShowDelay et Noyau en RAM^)...
        echo reg add "HKCUControl PanelDesktop" /v MenuShowDelay /t REG_SZ /d 0 /f ^>nul 2^>^&1
        echo reg add "HKLMSYSTEMCurrentControlSetControlSession ManagerMemory Management" /v DisablePagingExecutive /t REG_DWORD /d 1 /f ^>nul 2^>^&1
        echo reg add "HKLMSYSTEMCurrentControlSetControlSession ManagerMemory Management" /v LargeSystemCache /t REG_DWORD /d 1 /f ^>nul 2^>^&1
        echo reg add "HKLMSYSTEMCurrentControlSetControlFileSystem" /v NtfsDisableLastAccessUpdate /t REG_DWORD /d 1 /f ^>nul 2^>^&1
        echo reg add "HKLMSYSTEMCurrentControlSetControlPriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f ^>nul 2^>^&1
        echo reg add "HKLMSOFTWAREMicrosoftWindows NTCurrentVersionMultimediaSystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f ^>nul 2^>^&1
        echo reg add "HKLMSOFTWAREMicrosoftWindows NTCurrentVersionMultimediaSystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f ^>nul 2^>^&1
        echo powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c ^>nul 2^>^&1
        echo echo.
        echo echo [*] 3. Desactivation de SysMain / SuperFetch et services lourds...
        echo net stop SysMain ^>nul 2^>^&1
        echo sc config SysMain start= disabled ^>nul 2^>^&1
        echo net stop DiagTrack ^>nul 2^>^&1
        echo sc config DiagTrack start= disabled ^>nul 2^>^&1
        echo echo.
        echo echo [*] 4. Liberation de la memoire vive (Flush RAM^)...
        echo %%windir%%system32undll32.exe advapi32.dll,ProcessIdleTasks ^>nul 2^>^&1
        echo echo.
        echo echo ============================================================================
        echo echo [+] OPTIMISATION REUSSIE ! Votre PC Windows est accelere.
        echo echo ============================================================================
        echo pause
    ) > "%~dp0Haydar_Speed_Pro.bat"
    echo [+] Haydar_Speed_Pro.bat cree avec succes.
)

:: 2. METHODE 1 : Compilation native PowerShell / .NET C# (Recommandee Windows 7, 8, 10, 11)
where powershell >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Compilation ultra-rapide avec le compilateur natif Windows C#/.NET...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$source = @'
using System;
using System.Diagnostics;
using System.Windows.Forms;
namespace HaydarSpeedPro {
    static class Program {
        [STAThread]
        static void Main() {
            try {
                ProcessStartInfo psi = new ProcessStartInfo("cmd.exe", "/c \"" + AppDomain.CurrentDomain.BaseDirectory + "Haydar_Speed_Pro.bat\"");
                psi.Verb = "runas";
                psi.UseShellExecute = true;
                Process.Start(psi);
            } catch (Exception) {
                Process.Start("cmd.exe", "/c \"" + AppDomain.CurrentDomain.BaseDirectory + "Haydar_Speed_Pro.bat\"");
            }
        }
    }
}
'@;
Add-Type -TypeDefinition $source -Language CSharp -OutputAssembly ('{0}\Haydar_Speed_Pro.exe' -f (Get-Location)) -OutputType WindowsApplication -ReferencedAssemblies 'System.Windows.Forms.dll';
" >nul 2>&1

    if exist "%~dp0Haydar_Speed_Pro.exe" (
        goto compilation_success
    )
)

:: 3. METHODE 2 : Secours avec IExpress (Compatible Windows XP et superieurs)
echo [*] Generation du fichier de directive IExpress ANSI...
(
    echo [Version]
    echo Class=IEXPRESS
    echo SEDVersion=3
    echo [Options]
    echo PackagePurpose=InstallApp
    echo ShowInstallProgramWindow=0
    echo HideExtractAnimation=1
    echo UseLongFileName=1
    echo InsideCompressed=0
    echo CAB_FixedSize=0
    echo CAB_ResvCodeSigning=0
    echo RebootMode=N
    echo InstallPrompt=%%InstallPrompt%%
    echo DisplayLicense=%%DisplayLicense%%
    echo FinishMessage=%%FinishMessage%%
    echo TargetName=%%TargetName%%
    echo FriendlyName=%%FriendlyName%%
    echo AppLaunched=%%AppLaunched%%
    echo PostInstallCmd=%%PostInstallCmd%%
    echo AdminQuietInstCmd=%%AdminQuietInstCmd%%
    echo UserQuietInstCmd=%%UserQuietInstCmd%%
    echo SourceFiles=SourceFiles
    echo [SourceFiles]
    echo SourceFiles0=.
    echo [SourceFiles0]
    echo %%FILE0%%=
    echo [Strings]
    echo InstallPrompt=
    echo DisplayLicense=
    echo FinishMessage=Optimisation terminee !
    echo TargetName=%~dp0Haydar_Speed_Pro.exe
    echo FriendlyName=Haydar Speed Pro
    echo AppLaunched=cmd.exe /c "Haydar_Speed_Pro.bat"
    echo PostInstallCmd=^<None^>
    echo AdminQuietInstCmd=
    echo UserQuietInstCmd=
    echo FILE0="Haydar_Speed_Pro.bat"
) > "%~dp0Haydar_Speed_Pro.sed"

if exist "%windir%\system32\iexpress.exe" (
    echo [*] Execution de IExpress...
    "%windir%\system32\iexpress.exe" /N /Q "%~dp0Haydar_Speed_Pro.sed"
)

:compilation_success
if exist "%~dp0Haydar_Speed_Pro.exe" (
    echo.
    echo ============================================================================
    echo [+] SUCCES TOTAL ! LE FICHIER EXECUTABLE EST CREE AVEC SUCCES :
    echo.
    echo     ==^> %~dp0Haydar_Speed_Pro.exe
    echo.
    echo     Vous avez desormais votre application autonome .EXE !
    echo     Double-cliquez dessus ou emportez-le sur n'importe quel PC !
    echo.
    echo     [ Sadaqa Jariya ala rouh Akhi Haydar Hachani ]
    echo     صدقة جارية على روح أخي حيدر حشاني رحمه الله
    echo     Contact : hachaniinfos@gmail.com ^| WhatsApp +21655405159
    echo ============================================================================
) else (
    echo.
    echo [!] Vous pouvez lancer directement Haydar_Speed_Pro.bat pour accelerer votre PC.
    echo     Il execute exactement les memes optimisations en 1 clic !
)

echo.
pause
exit /b
