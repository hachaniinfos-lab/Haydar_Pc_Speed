@echo off
title Lancement de Haydar Speed Pro...
cd /d "%~dp0"

:: 1. Deblocage automatique des fichiers telecharges (supprime le verrou Zone.Identifier Windows)
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -Path '%~dp0' | Unblock-File -ErrorAction SilentlyContinue" >nul 2>&1

:: 2. Nettoyage des anciennes instances mshta.exe qui resteraient suspendues en arriere-plan
taskkill /f /im mshta.exe >nul 2>&1

:: 3. Priorite Microsoft Edge en Mode Application (Fenetre autonome moderne sans barre d'adresse)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    if exist "%~dp0Haydar_Speed_Pro.html" (
        start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="file:///%~dp0Haydar_Speed_Pro.html"
        exit /b
    )
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    if exist "%~dp0Haydar_Speed_Pro.html" (
        start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="file:///%~dp0Haydar_Speed_Pro.html"
        exit /b
    )
)

:: 4. Priorite Google Chrome en Mode Application
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    if exist "%~dp0Haydar_Speed_Pro.html" (
        start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="file:///%~dp0Haydar_Speed_Pro.html"
        exit /b
    )
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    if exist "%~dp0Haydar_Speed_Pro.html" (
        start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="file:///%~dp0Haydar_Speed_Pro.html"
        exit /b
    )
)

:: 5. Lancement MSHTA natif Windows (Compatible Windows XP SP3, 7, 8, 10 et 11)
if exist "%~dp0Haydar_Speed_Pro.hta" (
    start "" "%SystemRoot%\system32\mshta.exe" "%~dp0Haydar_Speed_Pro.hta"
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
