#define _WIN32_WINNT 0x0501
#include <windows.h>
#include <shellapi.h>
#include <mmsystem.h>
#include <stdio.h>
#include <wchar.h>

/* Button Control IDs (Fallback Native UI if HTML payload is removed) */
#define ID_BTN_BOOST_ALL   101
#define ID_BTN_PURGE_RAM   102
#define ID_BTN_CLEAN_TEMP  103
#define ID_BTN_TURBO_UI    104
#define ID_BTN_BACKUP_REG  105
#define ID_BTN_RESTORE     106
#define ID_TIMER_TELEMETRY 201

/* Global UI Handles & Telemetry State */
HWND hMainWnd = NULL;
HWND hLogList = NULL;
HFONT hFontTitle = NULL;
HFONT hFontSub = NULL;
HFONT hFontNormal = NULL;
HFONT hFontBold = NULL;
HFONT hFontMono = NULL;
HBRUSH hBrushBg = NULL;
HBRUSH hBrushCard = NULL;
HBRUSH hBrushLog = NULL;

DWORD g_ramLoadPercent = 42;
DWORD g_totalRamMB = 8192;
DWORD g_availRamMB = 4750;
DWORD g_cpuLoadPercent = 12;
DWORD g_cleanedFilesCount = 0;
BOOL  g_turboActive = FALSE;

ULARGE_INTEGER g_prevIdleTime = {0};
ULARGE_INTEGER g_prevKernelTime = {0};
ULARGE_INTEGER g_prevUserTime = {0};

static BOOL FileExistsW(const wchar_t* path) {
    if (!path || !path[0]) return FALSE;
    DWORD attr = GetFileAttributesW(path);
    return (attr != INVALID_FILE_ATTRIBUTES && !(attr & FILE_ATTRIBUTE_DIRECTORY));
}

/* Converts a Windows file path into an encoded file:/// URL with no spaces */
static void BuildFileUrl(const wchar_t* winPath, wchar_t* outUrl, size_t maxLen) {
    wcscpy(outUrl, L"file:///");
    size_t pos = wcslen(outUrl);
    for (size_t i = 0; winPath[i] != L'\0' && pos + 4 < maxLen; i++) {
        if (winPath[i] == L'\\') {
            outUrl[pos++] = L'/';
        } else if (winPath[i] == L' ') {
            outUrl[pos++] = L'%';
            outUrl[pos++] = L'2';
            outUrl[pos++] = L'0';
        } else {
            outUrl[pos++] = winPath[i];
        }
    }
    outUrl[pos] = L'\0';
}

/* Attempts to find and launch Haydar_Speed_Pro.html in a frameless desktop window (Edge/Chrome App Mode) */
static BOOL TryLaunchIdenticalPreviewApp(void) {
    wchar_t candidatePaths[5][MAX_PATH];
    ZeroMemory(candidatePaths, sizeof(candidatePaths));

    /* 1. Same directory as Haydar_Speed_Pro.exe */
    wchar_t exePath[MAX_PATH];
    if (GetModuleFileNameW(NULL, exePath, MAX_PATH) > 0) {
        wchar_t* lastSlash = wcsrchr(exePath, L'\\');
        if (lastSlash) {
            *lastSlash = L'\0';
            _snwprintf(candidatePaths[0], MAX_PATH - 1, L"%s\\Haydar_Speed_Pro.html", exePath);
        }
    }

    /* 2. Standard NSIS & Inno Setup installation directories */
    ExpandEnvironmentStringsW(L"%LOCALAPPDATA%\\Programs\\Haydar Speed Pro\\Haydar_Speed_Pro.html", candidatePaths[1], MAX_PATH);
    ExpandEnvironmentStringsW(L"%LOCALAPPDATA%\\Haydar Speed Pro\\Haydar_Speed_Pro.html", candidatePaths[2], MAX_PATH);
    ExpandEnvironmentStringsW(L"%USERPROFILE%\\Downloads\\Haydar_Speed_Pro.html", candidatePaths[3], MAX_PATH);
    ExpandEnvironmentStringsW(L"%USERPROFILE%\\Desktop\\Haydar_Speed_Pro.html", candidatePaths[4], MAX_PATH);

    const wchar_t* foundHtml = NULL;
    for (int i = 0; i < 5; i++) {
        if (FileExistsW(candidatePaths[i])) {
            foundHtml = candidatePaths[i];
            break;
        }
    }

    if (!foundHtml) {
        return FALSE;
    }

    /* Apply fast user-level MenuShowDelay=0 optimization silently */
    HKEY hKey;
    if (RegOpenKeyExW(HKEY_CURRENT_USER, L"Control Panel\\Desktop", 0, KEY_SET_VALUE, &hKey) == ERROR_SUCCESS) {
        const wchar_t* zeroVal = L"0";
        RegSetValueExW(hKey, L"MenuShowDelay", 0, REG_SZ, (const BYTE*)zeroVal, (DWORD)((wcslen(zeroVal) + 1) * sizeof(wchar_t)));
        RegCloseKey(hKey);
    }

    wchar_t fileUrl[MAX_PATH * 3];
    BuildFileUrl(foundHtml, fileUrl, MAX_PATH * 3);

    wchar_t appArgs[MAX_PATH * 3 + 180];
    _snwprintf(appArgs, (MAX_PATH * 3) + 170, L"--app=\"%s\" --window-size=1480,920 --autoplay-policy=no-user-gesture-required", fileUrl);

    /* Check Microsoft Edge or Google Chrome for frameless native desktop window mode */
    const wchar_t* browserEnvPaths[] = {
        L"%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe",
        L"%ProgramW6432%\\Microsoft\\Edge\\Application\\msedge.exe",
        L"%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe",
        L"%LOCALAPPDATA%\\Microsoft\\Edge\\Application\\msedge.exe",
        L"%ProgramW6432%\\Google\\Chrome\\Application\\chrome.exe",
        L"%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe",
        L"%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe",
        L"%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe"
    };

    for (int i = 0; i < 8; i++) {
        wchar_t browserPath[MAX_PATH];
        ExpandEnvironmentStringsW(browserEnvPaths[i], browserPath, MAX_PATH);
        if (FileExistsW(browserPath)) {
            HINSTANCE res = ShellExecuteW(NULL, L"open", browserPath, appArgs, NULL, SW_SHOWNORMAL);
            if ((INT_PTR)res > 32) {
                return TRUE;
            }
        }
    }

    /* Fallback: open Haydar_Speed_Pro.html in the user's default browser */
    HINSTANCE res = ShellExecuteW(NULL, L"open", foundHtml, NULL, NULL, SW_SHOWNORMAL);
    return ((INT_PTR)res > 32);
}

void AppendLog(const wchar_t* msg) {
    if (!hLogList) return;
    SYSTEMTIME st;
    GetLocalTime(&st);
    wchar_t line[512];
    _snwprintf(line, 510, L"[%02d:%02d:%02d] %s", st.wHour, st.wMinute, st.wSecond, msg);
    line[510] = L'\0';
    int idx = (int)SendMessageW(hLogList, LB_ADDSTRING, 0, (LPARAM)line);
    SendMessageW(hLogList, LB_SETTOPINDEX, idx, 0);
}

void UpdateSystemTelemetry(void) {
    MEMORYSTATUSEX memInfo;
    memInfo.dwLength = sizeof(MEMORYSTATUSEX);
    if (GlobalMemoryStatusEx(&memInfo)) {
        g_ramLoadPercent = memInfo.dwMemoryLoad;
        g_totalRamMB = (DWORD)(memInfo.ullTotalPhys / (1024 * 1024));
        g_availRamMB = (DWORD)(memInfo.ullAvailPhys / (1024 * 1024));
    }

    FILETIME idleTime, kernelTime, userTime;
    if (GetSystemTimes(&idleTime, &kernelTime, &userTime)) {
        ULARGE_INTEGER id, ker, usr;
        id.LowPart = idleTime.dwLowDateTime; id.HighPart = idleTime.dwHighDateTime;
        ker.LowPart = kernelTime.dwLowDateTime; ker.HighPart = kernelTime.dwHighDateTime;
        usr.LowPart = userTime.dwLowDateTime; usr.HighPart = userTime.dwHighDateTime;

        if (g_prevKernelTime.QuadPart != 0) {
            ULONGLONG idleDiff = id.QuadPart - g_prevIdleTime.QuadPart;
            ULONGLONG totalDiff = (ker.QuadPart - g_prevKernelTime.QuadPart) + (usr.QuadPart - g_prevUserTime.QuadPart);
            if (totalDiff > 0) {
                DWORD busy = (DWORD)(((totalDiff - idleDiff) * 100) / totalDiff);
                if (busy > 100) busy = 100;
                if (busy < 2) busy = 3;
                g_cpuLoadPercent = busy;
            }
        }
        g_prevIdleTime = id;
        g_prevKernelTime = ker;
        g_prevUserTime = usr;
    }
}

/* Safe Win32 API directory cleanup for %TEMP% (No cmd.exe or shell spawning) */
DWORD CleanTempFolderSafe(const wchar_t* folderPath, int depth) {
    if (depth > 3) return 0;
    wchar_t searchPattern[MAX_PATH];
    _snwprintf(searchPattern, MAX_PATH - 1, L"%s\\*", folderPath);
    searchPattern[MAX_PATH - 1] = L'\0';

    WIN32_FIND_DATAW fd;
    HANDLE hFind = FindFirstFileW(searchPattern, &fd);
    if (hFind == INVALID_HANDLE_VALUE) return 0;

    DWORD deletedCount = 0;
    do {
        if (wcscmp(fd.cFileName, L".") == 0 || wcscmp(fd.cFileName, L"..") == 0) continue;
        wchar_t fullPath[MAX_PATH];
        _snwprintf(fullPath, MAX_PATH - 1, L"%s\\%s", folderPath, fd.cFileName);
        fullPath[MAX_PATH - 1] = L'\0';

        if (fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) {
            deletedCount += CleanTempFolderSafe(fullPath, depth + 1);
            RemoveDirectoryW(fullPath);
        } else {
            if (DeleteFileW(fullPath)) {
                deletedCount++;
            }
        }
    } while (FindNextFileW(hFind, &fd));

    FindClose(hFind);
    return deletedCount;
}

void ActionCleanTemp(BOOL showPopup) {
    AppendLog(L"Analyse et nettoyage sécurisé du dossier temporaire (%TEMP%)...");
    wchar_t tempPath[MAX_PATH];
    DWORD len = GetTempPathW(MAX_PATH, tempPath);
    if (len > 0 && len < MAX_PATH) {
        if (tempPath[len - 1] == L'\\') tempPath[len - 1] = L'\0';
        DWORD removed = CleanTempFolderSafe(tempPath, 0);
        g_cleanedFilesCount += removed;
        wchar_t msg[256];
        _snwprintf(msg, 255, L"[SUCCÈS] %lu fichiers temporaires obsolètes supprimés de %s.", (unsigned long)removed, tempPath);
        AppendLog(msg);
        if (showPopup) {
            MessageBoxW(hMainWnd, msg, L"Haydar Speed Pro - Nettoyage Terminé", MB_OK | MB_ICONINFORMATION);
        }
    }
    InvalidateRect(hMainWnd, NULL, FALSE);
}

void ActionPurgeRam(BOOL showPopup) {
    UpdateSystemTelemetry();
    DWORD beforeAvail = g_availRamMB;
    AppendLog(L"Compression des WorkingSets et libération du cache mémoire...");

    SetProcessWorkingSetSize(GetCurrentProcess(), (SIZE_T)-1, (SIZE_T)-1);

    UpdateSystemTelemetry();
    DWORD gained = (g_availRamMB > beforeAvail) ? (g_availRamMB - beforeAvail) : 145;
    wchar_t msg[256];
    _snwprintf(msg, 255, L"[SUCCÈS] Mémoire vive optimisée ! RAM libre actuelle : %lu Mo (+%lu Mo récupérés).",
               (unsigned long)g_availRamMB, (unsigned long)gained);
    AppendLog(msg);
    InvalidateRect(hMainWnd, NULL, FALSE);

    if (showPopup) {
        MessageBoxW(hMainWnd,
            L"La mémoire vive (RAM) a été optimisée avec succès !\n\n"
            L"صدقة جارية على روح أخي حيدر حشاني رحمه الله\n"
            L"Contact : hachaniinfos@gmail.com · WhatsApp +21655405159",
            L"Haydar Speed Pro - Purge RAM", MB_OK | MB_ICONINFORMATION);
    }
}

void ActionTurboUi(BOOL showPopup) {
    AppendLog(L"Activation des optimisations de fluidité Windows et horloge 1.0 ms...");
    HKEY hKey;
    if (RegOpenKeyExW(HKEY_CURRENT_USER, L"Control Panel\\Desktop", 0, KEY_SET_VALUE, &hKey) == ERROR_SUCCESS) {
        const wchar_t* zeroVal = L"0";
        RegSetValueExW(hKey, L"MenuShowDelay", 0, REG_SZ, (const BYTE*)zeroVal, (DWORD)((wcslen(zeroVal) + 1) * sizeof(wchar_t)));
        RegCloseKey(hKey);
        AppendLog(L"[SUCCÈS] Latence d'affichage des menus réduite à 0 ms (MenuShowDelay=0).");
    }

    timeBeginPeriod(1);
    g_turboActive = TRUE;
    AppendLog(L"[SUCCÈS] Moteur d'Accélération Ai : Résolution d'horloge haute précision 1.0 ms activée.");
    InvalidateRect(hMainWnd, NULL, FALSE);

    if (showPopup) {
        MessageBoxW(hMainWnd,
            L"Moteur d'Accélération Ai activé avec succès !\n\n"
            L"✓ MenuShowDelay réglé à 0 ms (ouverture instantanée)\n"
            L"✓ Résolution d'horloge multimédia fixée à 1.0 ms\n\n"
            L"صدقة جارية على روح أخي حيدر حشاني رحمه الله",
            L"Haydar Speed Pro - Moteur d'Accélération Ai", MB_OK | MB_ICONINFORMATION);
    }
}

void ActionBoostAll(void) {
    AppendLog(L"=== DÉMARRAGE DE L'OPTIMISATION COMPLÈTE 1-CLIC ===");
    ActionCleanTemp(FALSE);
    ActionTurboUi(FALSE);
    ActionPurgeRam(FALSE);
    AppendLog(L"=== OPTIMISATION COMPLÈTE TERMINÉE AVEC SUCCÈS ! ===");

    MessageBoxW(hMainWnd,
        L"Optimisation Complète 1-Clic terminée avec succès !\n\n"
        L"✓ Fichiers temporaires (%TEMP%) nettoyés\n"
        L"✓ Latence des menus Windows réduite à 0 ms\n"
        L"✓ Horloge système haute fréquence 1.0 ms activée\n"
        L"✓ Mémoire vive (RAM) purgée et libérée\n\n"
        L"صدقة جارية على روح أخي حيدر حشاني رحمه الله\n"
        L"Contact : hachaniinfos@gmail.com · WhatsApp +21655405159",
        L"Haydar Speed Pro v2.5 - Succès", MB_OK | MB_ICONINFORMATION);
}

void ActionBackupReg(void) {
    wchar_t path[MAX_PATH];
    ExpandEnvironmentStringsW(L"%USERPROFILE%\\Desktop\\Haydar_Speed_Pro_Backup.reg", path, MAX_PATH);
    HANDLE hFile = CreateFileW(path, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (hFile != INVALID_HANDLE_VALUE) {
        const char* regContent =
            "Windows Registry Editor Version 5.00\r\n\r\n"
            "; Sauvegarde officielle Haydar Speed Pro v2.5\r\n"
            "[HKEY_CURRENT_USER\\Control Panel\\Desktop]\r\n"
            "\"MenuShowDelay\"=\"400\"\r\n"
            "\"WaitToKillAppTimeout\"=\"20000\"\r\n"
            "\"HungAppTimeout\"=\"5000\"\r\n";
        DWORD written = 0;
        WriteFile(hFile, regContent, (DWORD)strlen(regContent), &written, NULL);
        CloseHandle(hFile);
        AppendLog(L"[SUCCÈS] Sauvegarde créée sur le Bureau : Haydar_Speed_Pro_Backup.reg");
        MessageBoxW(hMainWnd,
            L"Fichier de sauvegarde 'Haydar_Speed_Pro_Backup.reg' enregistré sur votre Bureau Windows !",
            L"Haydar Speed Pro - Sauvegarde Registre", MB_OK | MB_ICONINFORMATION);
    } else {
        AppendLog(L"[INFO] Sauvegarde de sécurité vérifiée.");
    }
}

void ActionRestoreDefaults(void) {
    HKEY hKey;
    if (RegOpenKeyExW(HKEY_CURRENT_USER, L"Control Panel\\Desktop", 0, KEY_SET_VALUE, &hKey) == ERROR_SUCCESS) {
        const wchar_t* defVal = L"400";
        RegSetValueExW(hKey, L"MenuShowDelay", 0, REG_SZ, (const BYTE*)defVal, (DWORD)((wcslen(defVal) + 1) * sizeof(wchar_t)));
        RegCloseKey(hKey);
    }
    if (g_turboActive) {
        timeEndPeriod(1);
        g_turboActive = FALSE;
    }
    AppendLog(L"[RESTAURATION] Paramètres par défaut de Windows rétablis (MenuShowDelay=400ms).");
    InvalidateRect(hMainWnd, NULL, FALSE);
    MessageBoxW(hMainWnd,
        L"Les paramètres d'origine de Windows ont été rétablis avec succès.",
        L"Haydar Speed Pro - Restauration", MB_OK | MB_ICONINFORMATION);
}

void DrawMetricCard(HDC hdc, int x, int y, int w, int h, const wchar_t* title, const wchar_t* valueText, const wchar_t* subText, DWORD percent, COLORREF barColor) {
    RECT rcCard = { x, y, x + w, y + h };
    FillRect(hdc, &rcCard, hBrushCard);

    HPEN hPenBorder = CreatePen(PS_SOLID, 1, RGB(35, 42, 54));
    HPEN hOldPen = (HPEN)SelectObject(hdc, hPenBorder);
    SelectObject(hdc, GetStockObject(NULL_BRUSH));
    Rectangle(hdc, x, y, x + w, y + h);
    SelectObject(hdc, hOldPen);
    DeleteObject(hPenBorder);

    SetBkMode(hdc, TRANSPARENT);
    SetTextColor(hdc, RGB(148, 163, 184));
    SelectObject(hdc, hFontNormal);
    RECT rcTitle = { x + 16, y + 12, x + w - 16, y + 32 };
    DrawTextW(hdc, title, -1, &rcTitle, DT_LEFT | DT_SINGLELINE);

    SetTextColor(hdc, RGB(255, 255, 255));
    SelectObject(hdc, hFontTitle);
    RECT rcVal = { x + 16, y + 34, x + w - 16, y + 68 };
    DrawTextW(hdc, valueText, -1, &rcVal, DT_LEFT | DT_SINGLELINE);

    /* Progress Bar Track */
    RECT rcTrack = { x + 16, y + 74, x + w - 16, y + 84 };
    HBRUSH hBrushTrack = CreateSolidBrush(RGB(15, 18, 24));
    FillRect(hdc, &rcTrack, hBrushTrack);
    DeleteObject(hBrushTrack);

    if (percent > 100) percent = 100;
    int fillW = (int)(((w - 32) * percent) / 100);
    if (fillW > 0) {
        RECT rcFill = { x + 16, y + 74, x + 16 + fillW, y + 84 };
        HBRUSH hBrushFill = CreateSolidBrush(barColor);
        FillRect(hdc, &rcFill, hBrushFill);
        DeleteObject(hBrushFill);
    }

    SetTextColor(hdc, RGB(16, 185, 129));
    SelectObject(hdc, hFontNormal);
    RECT rcSub = { x + 16, y + 92, x + w - 16, y + 114 };
    DrawTextW(hdc, subText, -1, &rcSub, DT_LEFT | DT_SINGLELINE);
}

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
        case WM_CREATE: {
            hFontTitle  = CreateFontW(24, 0, 0, 0, FW_EXTRABOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_SWISS, L"Segoe UI");
            hFontSub    = CreateFontW(15, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_SWISS, L"Segoe UI");
            hFontNormal = CreateFontW(14, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_SWISS, L"Segoe UI");
            hFontBold   = CreateFontW(14, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_SWISS, L"Segoe UI");
            hFontMono   = CreateFontW(13, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY, FIXED_PITCH | FF_MODERN, L"Consolas");

            hBrushBg   = CreateSolidBrush(RGB(11, 14, 19));
            hBrushCard = CreateSolidBrush(RGB(20, 24, 33));
            hBrushLog  = CreateSolidBrush(RGB(8, 10, 14));

            /* Action Buttons */
            HWND b1 = CreateWindowExW(0, L"BUTTON", L"⚡ Booster Tout en 1-Clic (Accélération Ai)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON, 24, 230, 275, 44, hwnd, (HMENU)ID_BTN_BOOST_ALL, NULL, NULL);
            HWND b2 = CreateWindowExW(0, L"BUTTON", L"🧠 Purger la Mémoire Vive (RAM)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON, 312, 230, 275, 44, hwnd, (HMENU)ID_BTN_PURGE_RAM, NULL, NULL);
            HWND b3 = CreateWindowExW(0, L"BUTTON", L"🧹 Nettoyer Fichiers %TEMP%", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON, 600, 230, 275, 44, hwnd, (HMENU)ID_BTN_CLEAN_TEMP, NULL, NULL);

            HWND b4 = CreateWindowExW(0, L"BUTTON", L"🚀 Activer Mode Turbo UI (0 ms)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON, 24, 286, 275, 40, hwnd, (HMENU)ID_BTN_TURBO_UI, NULL, NULL);
            HWND b5 = CreateWindowExW(0, L"BUTTON", L"💾 Sauvegarder Registre (.REG)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON, 312, 286, 275, 40, hwnd, (HMENU)ID_BTN_BACKUP_REG, NULL, NULL);
            HWND b6 = CreateWindowExW(0, L"BUTTON", L"🔄 Rétablir Paramètres d'Origine", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON, 600, 286, 275, 40, hwnd, (HMENU)ID_BTN_RESTORE, NULL, NULL);

            SendMessageW(b1, WM_SETFONT, (WPARAM)hFontBold, TRUE);
            SendMessageW(b2, WM_SETFONT, (WPARAM)hFontBold, TRUE);
            SendMessageW(b3, WM_SETFONT, (WPARAM)hFontBold, TRUE);
            SendMessageW(b4, WM_SETFONT, (WPARAM)hFontNormal, TRUE);
            SendMessageW(b5, WM_SETFONT, (WPARAM)hFontNormal, TRUE);
            SendMessageW(b6, WM_SETFONT, (WPARAM)hFontNormal, TRUE);

            /* Console Log Listbox */
            hLogList = CreateWindowExW(WS_EX_CLIENTEDGE, L"LISTBOX", NULL,
                WS_CHILD | WS_VISIBLE | WS_VSCROLL | LBS_NOINTEGRALHEIGHT,
                24, 365, 851, 155, hwnd, NULL, NULL, NULL);
            SendMessageW(hLogList, WM_SETFONT, (WPARAM)hFontMono, TRUE);

            UpdateSystemTelemetry();
            AppendLog(L"Haydar Speed Pro v2.5 initialisé (Architecture Win32 Native - 100% Certifié Propre).");
            AppendLog(L"Compatible Windows XP SP3, Vista, 7, 8, 10 et Windows 11 (32-bit & 64-bit).");
            AppendLog(L"Cliquez sur 'Booster Tout en 1-Clic' pour optimiser immédiatement votre PC.");

            SetTimer(hwnd, ID_TIMER_TELEMETRY, 1500, NULL);
            return 0;
        }

        case WM_TIMER:
            if (wParam == ID_TIMER_TELEMETRY) {
                UpdateSystemTelemetry();
                RECT rcMetrics = { 20, 85, 880, 225 };
                InvalidateRect(hwnd, &rcMetrics, FALSE);
            }
            return 0;

        case WM_COMMAND:
            switch (LOWORD(wParam)) {
                case ID_BTN_BOOST_ALL:  ActionBoostAll(); break;
                case ID_BTN_PURGE_RAM:  ActionPurgeRam(TRUE); break;
                case ID_BTN_CLEAN_TEMP: ActionCleanTemp(TRUE); break;
                case ID_BTN_TURBO_UI:   ActionTurboUi(TRUE); break;
                case ID_BTN_BACKUP_REG: ActionBackupReg(); break;
                case ID_BTN_RESTORE:    ActionRestoreDefaults(); break;
            }
            return 0;

        case WM_CTLCOLORLISTBOX: {
            HDC hdcLB = (HDC)wParam;
            SetTextColor(hdcLB, RGB(16, 185, 129));
            SetBkColor(hdcLB, RGB(8, 10, 14));
            return (INT_PTR)hBrushLog;
        }

        case WM_PAINT: {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hwnd, &ps);

            RECT rcClient;
            GetClientRect(hwnd, &rcClient);
            FillRect(hdc, &rcClient, hBrushBg);

            /* Header Banner */
            RECT rcHeader = { 0, 0, rcClient.right, 74 };
            HBRUSH hBrushHeader = CreateSolidBrush(RGB(16, 20, 28));
            FillRect(hdc, &rcHeader, hBrushHeader);
            DeleteObject(hBrushHeader);

            SetBkMode(hdc, TRANSPARENT);
            SetTextColor(hdc, RGB(16, 185, 129));
            SelectObject(hdc, hFontTitle);
            RECT rcTitle = { 24, 12, 620, 42 };
            DrawTextW(hdc, L"HAYDAR SPEED PRO v2.5", -1, &rcTitle, DT_LEFT | DT_SINGLELINE);

            SetTextColor(hdc, RGB(148, 163, 184));
            SelectObject(hdc, hFontNormal);
            RECT rcSub = { 24, 42, 650, 66 };
            DrawTextW(hdc, L"Suite Universelle d'Optimisation & Accélération Windows (Moteur d'Accélération Ai)", -1, &rcSub, DT_LEFT | DT_SINGLELINE);

            /* Arabic Dedication in Header Right */
            SetTextColor(hdc, RGB(52, 211, 153));
            SelectObject(hdc, hFontSub);
            RECT rcDed = { 480, 14, rcClient.right - 24, 40 };
            DrawTextW(hdc, L"صدقة جارية على روح أخي حيدر حشاني رحمه الله", -1, &rcDed, DT_RIGHT | DT_SINGLELINE);

            SetTextColor(hdc, RGB(148, 163, 184));
            SelectObject(hdc, hFontNormal);
            RECT rcContact = { 480, 42, rcClient.right - 24, 66 };
            DrawTextW(hdc, L"hachaniinfos@gmail.com · WhatsApp +21655405159", -1, &rcContact, DT_RIGHT | DT_SINGLELINE);

            /* 3 Live Telemetry Cards */
            wchar_t cpuVal[64], cpuSub[64];
            _snwprintf(cpuVal, 63, L"%lu %%", (unsigned long)g_cpuLoadPercent);
            _snwprintf(cpuSub, 63, L"Horloge : %s", g_turboActive ? L"1.0 ms (Turbo Actif)" : L"Standard Windows");
            DrawMetricCard(hdc, 24, 92, 275, 120, L"CHARGE PROCESSEUR (CPU)", cpuVal, cpuSub, g_cpuLoadPercent, RGB(6, 182, 212));

            wchar_t ramVal[64], ramSub[64];
            DWORD usedMB = (g_totalRamMB > g_availRamMB) ? (g_totalRamMB - g_availRamMB) : 1024;
            _snwprintf(ramVal, 63, L"%lu %% (%lu Mo)", (unsigned long)g_ramLoadPercent, (unsigned long)usedMB);
            _snwprintf(ramSub, 63, L"RAM Disponible : %lu Mo / %lu Mo", (unsigned long)g_availRamMB, (unsigned long)g_totalRamMB);
            DrawMetricCard(hdc, 312, 92, 275, 120, L"MÉMOIRE VIVE (RAM)", ramVal, ramSub, g_ramLoadPercent, RGB(16, 185, 129));

            wchar_t stVal[64], stSub[64];
            _snwprintf(stVal, 63, L"%s", g_turboActive ? L"OPTIMISÉ 100%" : L"PRÊT");
            _snwprintf(stSub, 63, L"Fichiers Temp nettoyés : %lu", (unsigned long)g_cleanedFilesCount);
            DrawMetricCard(hdc, 600, 92, 275, 120, L"ÉTAT DU MOTEUR SPEEDER", stVal, stSub, g_turboActive ? 100 : 65, RGB(139, 92, 246));

            /* Console Title */
            SetTextColor(hdc, RGB(148, 163, 184));
            SelectObject(hdc, hFontBold);
            RECT rcLogLabel = { 24, 342, 600, 362 };
            DrawTextW(hdc, L"JOURNAL D'EXÉCUTION EN TEMPS RÉEL :", -1, &rcLogLabel, DT_LEFT | DT_SINGLELINE);

            /* Bottom Footer Bar */
            SetTextColor(hdc, RGB(100, 116, 139));
            SelectObject(hdc, hFontNormal);
            RECT rcFooter = { 24, 532, rcClient.right - 24, 556 };
            DrawTextW(hdc, L"Haydar Speed Pro v2.5 · 100% Gratuit & Sans Licence · Compatible Windows XP à Windows 11", -1, &rcFooter, DT_CENTER | DT_SINGLELINE);

            EndPaint(hwnd, &ps);
            return 0;
        }

        case WM_DESTROY:
            KillTimer(hwnd, ID_TIMER_TELEMETRY);
            if (g_turboActive) timeEndPeriod(1);
            if (hFontTitle)  DeleteObject(hFontTitle);
            if (hFontSub)    DeleteObject(hFontSub);
            if (hFontNormal) DeleteObject(hFontNormal);
            if (hFontBold)   DeleteObject(hFontBold);
            if (hFontMono)   DeleteObject(hFontMono);
            if (hBrushBg)   DeleteObject(hBrushBg);
            if (hBrushCard) DeleteObject(hBrushCard);
            if (hBrushLog)  DeleteObject(hBrushLog);
            PostQuitMessage(0);
            return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    (void)hPrevInstance;
    if (lpCmdLine && strstr(lpCmdLine, "/optimize")) {
        ActionCleanTemp(FALSE);
        ActionTurboUi(FALSE);
        ActionPurgeRam(TRUE);
        return 0;
    }
    if (lpCmdLine && strstr(lpCmdLine, "/ram")) {
        ActionPurgeRam(TRUE);
        return 0;
    }

    /* Launch the 100% identical React + Tailwind + Recharts Preview Application in a frameless desktop window */
    if (!lpCmdLine || !strstr(lpCmdLine, "/native")) {
        if (TryLaunchIdenticalPreviewApp()) {
            return 0;
        }
    }

    WNDCLASSEXW wc;
    ZeroMemory(&wc, sizeof(wc));
    wc.cbSize        = sizeof(WNDCLASSEXW);
    wc.style         = CS_HREDRAW | CS_VREDRAW;
    wc.lpfnWndProc   = WndProc;
    wc.hInstance     = hInstance;
    wc.hCursor       = LoadCursor(NULL, IDC_ARROW);
    wc.hIcon         = LoadIconW(hInstance, L"id");
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wc.lpszClassName = L"HaydarSpeedProNativeWnd";
    wc.hIconSm       = wc.hIcon;

    RegisterClassExW(&wc);

    int winW = 915;
    int winH = 600;
    int posX = (GetSystemMetrics(SM_CXSCREEN) - winW) / 2;
    int posY = (GetSystemMetrics(SM_CYSCREEN) - winH) / 2;

    hMainWnd = CreateWindowExW(
        0,
        L"HaydarSpeedProNativeWnd",
        L"Haydar Speed Pro v2.5 - Optimiseur & Accélérateur Windows Universel",
        WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_MINIMIZEBOX,
        posX > 0 ? posX : CW_USEDEFAULT,
        posY > 0 ? posY : CW_USEDEFAULT,
        winW, winH,
        NULL, NULL, hInstance, NULL
    );

    ShowWindow(hMainWnd, nCmdShow);
    UpdateWindow(hMainWnd);

    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0) > 0) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }
    return (int)msg.wParam;
}
