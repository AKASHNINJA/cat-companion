'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setIgnoreMouseEvents: (ignore, opts) => ipcRenderer.send('set-ignore-mouse-events', ignore, opts),
  showContextMenu:      ()            => ipcRenderer.send('show-context-menu'),
  moveWindow:           (x, y)        => ipcRenderer.send('move-window', x, y),
  getWindowPosition:    ()            => ipcRenderer.invoke('get-window-position'),
  getScreenSize:        ()            => ipcRenderer.invoke('get-screen-size'),
});
