; ============================================================================
; INSTALLATEUR OFFICIEL WINDOWS POUR HAYDAR SPEED PRO (WIZARD STANDARD)
; Compatible : Windows XP SP3, Vista, Windows 7, 8, 8.1, 10 et Windows 11 (32 & 64-bit)
;
; صدقة جارية على روح أخي حيدر حشاني رحمه الله
; Contacter le créateur : hachaniinfos@gmail.com · WhatsApp +21655405159
; ============================================================================

!include "MUI2.nsh"
!include "FileFunc.nsh"

; Nom et fichier de sortie
Name "Haydar Speed Pro"
OutFile "public/Haydar_Speed_Pro_Setup.exe"
Unicode True
RequestExecutionLevel admin

; Dossier d'installation par défaut
InstallDir "$PROGRAMFILES\Haydar Speed Pro"
InstallDirRegKey HKLM "Software\HaydarSpeedPro" "Install_Dir"

; --------------------------------------------------
; Configuration de l'interface Modern UI 2
; --------------------------------------------------
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; 1. Page de bienvenue
!define MUI_WELCOMEPAGE_TITLE "Bienvenue dans l'assistant d'installation de Haydar Speed Pro"
!define MUI_WELCOMEPAGE_TEXT "Cet assistant va vous guider à travers les étapes standard d'installation de Haydar Speed Pro sur votre ordinateur Windows.\r\n\r\nCompatible de Windows XP SP3 jusqu'à Windows 11 (32-bit et 64-bit).\r\n\r\nصدقة جارية على روح أخي حيدر حشاني رحمه الله\r\n\r\nCliquez sur Suivant pour continuer."
!insertmacro MUI_PAGE_WELCOME

; 2. Page de licence / Dédicace
!define MUI_LICENSEPAGE_CHECKBOX
!define MUI_LICENSEPAGE_TEXT_TOP "Veuillez lire les informations suivantes avant de continuer :"
!define MUI_LICENSEPAGE_TEXT_BOTTOM "Logiciel entièrement bénévole, sans licence ni abonnement."
!insertmacro MUI_PAGE_LICENSE "build_assets/LICENSE.txt"

; 3. Page de sélection des composants
!insertmacro MUI_PAGE_COMPONENTS

; 4. Page de sélection du dossier d'installation
!insertmacro MUI_PAGE_DIRECTORY

; 5. Page d'installation des fichiers avec barre de progression
!insertmacro MUI_PAGE_INSTFILES

; 6. Page finale avec option de lancement
!define MUI_FINISHPAGE_RUN "$INSTDIR\Haydar_Speed_Pro.hta"
!define MUI_FINISHPAGE_RUN_TEXT "Lancer Haydar Speed Pro maintenant"
!define MUI_FINISHPAGE_SHOWREADME ""
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Créer une icône sur le Bureau"
!define MUI_FINISHPAGE_SHOWREADME_FUNCTION CreateDesktopShortcutOpt
!define MUI_FINISHPAGE_TEXT "Haydar Speed Pro a été installé avec succès sur votre ordinateur Windows.\r\n\r\nصدقة جارية على روح أخي حيدر حشاني رحمه الله\r\nContact : hachaniinfos@gmail.com | WhatsApp +21655405159"
!insertmacro MUI_PAGE_FINISH

; Pages du désinstallateur
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Langue : Français
!insertmacro MUI_LANGUAGE "French"

; --------------------------------------------------
; Sections d'installation
; --------------------------------------------------
Section "Application Principale (Requis)" SecCore
  SectionIn RO
  SetOutPath "$INSTDIR"
  
  ; Copie des fichiers
  File "build_assets/Haydar_Speed_Pro.hta"
  File "build_assets/Haydar_Speed_Pro.bat"
  File "build_assets/Liberer_RAM.vbs"
  File "build_assets/Restaurer_Defaut.bat"
  File "build_assets/LISEZMOI_Guide.txt"
  
  ; Écriture dans le registre Windows (Désinstallation propre dans le Panneau de configuration)
  WriteRegStr HKLM "Software\HaydarSpeedPro" "Install_Dir" "$INSTDIR"
  
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HaydarSpeedPro" "DisplayName" "Haydar Speed Pro (Optimiseur Windows)"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HaydarSpeedPro" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HaydarSpeedPro" "DisplayIcon" "$INSTDIR\Haydar_Speed_Pro.hta"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HaydarSpeedPro" "Publisher" "Haider Hachani Charity"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HaydarSpeedPro" "DisplayVersion" "2.4"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HaydarSpeedPro" "HelpLink" "mailto:hachaniinfos@gmail.com"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HaydarSpeedPro" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HaydarSpeedPro" "NoRepair" 1
  
  ; Création du désinstallateur
  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Raccourcis dans le Menu Démarrer" SecStartMenu
  CreateDirectory "$SMPROGRAMS\Haydar Speed Pro"
  CreateShortcut "$SMPROGRAMS\Haydar Speed Pro\Haydar Speed Pro.lnk" "$INSTDIR\Haydar_Speed_Pro.hta" "" "$INSTDIR\Haydar_Speed_Pro.hta" 0
  CreateShortcut "$SMPROGRAMS\Haydar Speed Pro\Optimisation 1-Clic Rapide.lnk" "$INSTDIR\Haydar_Speed_Pro.bat" "" "$INSTDIR\Haydar_Speed_Pro.bat" 0
  CreateShortcut "$SMPROGRAMS\Haydar Speed Pro\Vider la RAM.lnk" "$INSTDIR\Liberer_RAM.vbs" "" "$INSTDIR\Liberer_RAM.vbs" 0
  CreateShortcut "$SMPROGRAMS\Haydar Speed Pro\Désinstaller Haydar Speed Pro.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\Uninstall.exe" 0
SectionEnd

Section "Raccourci sur le Bureau" SecDesktop
  CreateShortcut "$DESKTOP\Haydar Speed Pro.lnk" "$INSTDIR\Haydar_Speed_Pro.hta" "" "$INSTDIR\Haydar_Speed_Pro.hta" 0
SectionEnd

; Descriptions
LangString DESC_SecCore ${LANG_FRENCH} "Les composants principaux de Haydar Speed Pro (moteur d'accélération, nettoyeur et purgeur RAM)."
LangString DESC_SecStartMenu ${LANG_FRENCH} "Ajoute un groupe dans le menu Démarrer pour un accès rapide."
LangString DESC_SecDesktop ${LANG_FRENCH} "Place un raccourci direct sur votre Bureau Windows."

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecCore} $(DESC_SecCore)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecStartMenu} $(DESC_SecStartMenu)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} $(DESC_SecDesktop)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

Function CreateDesktopShortcutOpt
  CreateShortcut "$DESKTOP\Haydar Speed Pro.lnk" "$INSTDIR\Haydar_Speed_Pro.hta" "" "$INSTDIR\Haydar_Speed_Pro.hta" 0
FunctionEnd

; --------------------------------------------------
; Section de désinstallation
; --------------------------------------------------
Section "Uninstall"
  Delete "$INSTDIR\Haydar_Speed_Pro.hta"
  Delete "$INSTDIR\Haydar_Speed_Pro.bat"
  Delete "$INSTDIR\Liberer_RAM.vbs"
  Delete "$INSTDIR\Restaurer_Defaut.bat"
  Delete "$INSTDIR\LISEZMOI_Guide.txt"
  Delete "$INSTDIR\Uninstall.exe"
  
  Delete "$DESKTOP\Haydar Speed Pro.lnk"
  Delete "$SMPROGRAMS\Haydar Speed Pro\Haydar Speed Pro.lnk"
  Delete "$SMPROGRAMS\Haydar Speed Pro\Optimisation 1-Clic Rapide.lnk"
  Delete "$SMPROGRAMS\Haydar Speed Pro\Vider la RAM.lnk"
  Delete "$SMPROGRAMS\Haydar Speed Pro\Désinstaller Haydar Speed Pro.lnk"
  RMDir "$SMPROGRAMS\Haydar Speed Pro"
  
  RMDir "$INSTDIR"
  
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HaydarSpeedPro"
  DeleteRegKey HKLM "Software\HaydarSpeedPro"
SectionEnd
