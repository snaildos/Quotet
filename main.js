const { autoUpdater } = require('electron-updater');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const { app, BrowserWindow, ipcMain } = require('electron');
const { watchFile } = require('fs');


// wait function
function wait(ms)
{
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while(d2-d < ms);
}

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
      width: 1000,
      height: 220,
      titleBarStyle: 'hide',
      transparent: true,
      frame: true,
      resizable: false,
      hasShadow: false,
      opacity: 0.8,
    icon: 'quotet.ico',
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setResizable(false)
  mainWindow.loadFile('index.html');
  mainWindow.on('maximize', () => mainWindow.unmaximize());
    mainWindow.show();
    console.log("Ok! Window init, let's check for updates...")
    autoUpdater.checkForUpdatesAndNotify();
    console.log("Update checked. Let's see what happens!");

  
  
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

console.log("Main screen ready.");

app.on('ready', () => {
  console.log("Send check for updates signal...");
  console.log("Alright, lets go!");
  setTimeout(() => {
    createWindow();
  }, 1);
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

