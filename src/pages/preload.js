// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openTerminal: () => ipcRenderer.send('open-terminal')
});
