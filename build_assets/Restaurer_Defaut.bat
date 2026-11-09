@echo off
title Haydar Speed Pro - Restauration des parametres
reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d "400" /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 0 /f >nul 2>&1
sc config SysMain start= auto >nul 2>&1
net start SysMain >nul 2>&1
echo [V] Parametres d'origine Windows restaures.
pause
