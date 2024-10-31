// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ruta del archivo preload.js
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL('http://localhost:8100'); // Cambia esto si tienes una URL o ruta local para tu app Ionic
}

app.on('ready', createWindow);

// Evento para abrir la terminal
ipcMain.on('open-terminal', () => {
  const command = process.platform === 'win32' ? 'start cmd' : 'open -a Terminal';
  exec(command, (error) => {
    if (error) {
      console.error(`Error al abrir la terminal: ${error}`);
    }
  });
});
