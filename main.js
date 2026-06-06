'use strict';

const { app, BrowserWindow, ipcMain, Menu, screen, Tray, nativeImage } = require('electron');
const path = require('path');

let win, tray;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('companion.html');
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Start fully click-through; renderer toggles this based on mouse position
  win.setIgnoreMouseEvents(true, { forward: true });
}

function createTray() {
  // Minimal 1x1 transparent PNG — tray icon will be mostly invisible on Windows
  // but provides right-click access. Improve by swapping in a real icon.png later.
  const emptyIcon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU5EggmCC' +
    'wAAACBJREFUOI1jYBgFgx0AAQABAAEAAQABAAEAAQABAAEAAQABAAJAAAFuJFSuAAAAAElFTkSuQmCC'
  );
  tray = new Tray(emptyIcon);
  tray.setToolTip('Pixel Companion — right-click pet to quit');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Pixel Companion', enabled: false },
    { type: 'separator' },
    { label: 'Always on Top', type: 'checkbox', checked: true,
      click(item) { win && win.setAlwaysOnTop(item.checked, 'screen-saver'); } },
    { label: 'Hide / Show', click() { win && (win.isVisible() ? win.hide() : win.show()); } },
    { type: 'separator' },
    { label: 'Quit', click() { app.quit(); } },
  ]));
  tray.on('double-click', () => { win && (win.isVisible() ? win.hide() : win.show()); });
}

// ── IPC handlers ──────────────────────────────────────────────────────────────

ipcMain.on('set-ignore-mouse-events', (_e, ignore, opts) => {
  win && win.setIgnoreMouseEvents(ignore, opts || {});
});

ipcMain.on('show-context-menu', () => {
  const menu = Menu.buildFromTemplate([
    { label: 'Always on Top', type: 'checkbox', checked: win ? win.isAlwaysOnTop() : true,
      click(item) { win && win.setAlwaysOnTop(item.checked, 'screen-saver'); } },
    { type: 'separator' },
    { label: 'Quit', click() { app.quit(); } },
  ]);
  menu.popup({ window: win });
});

ipcMain.on('move-window', (_e, x, y) => {
  win && win.setPosition(Math.round(x), Math.round(y), false);
});

ipcMain.handle('get-window-position', () => win ? win.getPosition() : [0, 0]);
ipcMain.handle('get-screen-size', () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  return { width, height };
});

// ── App lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
