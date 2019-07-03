const electron = require("electron");
const electronReload = require("electron-reload");
const isDev = require("electron-is-dev");
const path = require("path");
const url = require("url");
const log = require('electron-log');
const app = electron.app;

// if (isDev) {
  electronReload(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
    hardResetMethod: "exit"
  });
// }

let mainWindow;

function createWindow() {

  log.catchErrors();

  mainWindow = new electron.BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.maximize();

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "./index.html"),
      protocol: "file:",
      slashes: true
    })
  );

   if (isDev) {
     mainWindow.webContents.openDevTools();
   }

  // if (!isDev) {
    mainWindow.setFullScreen(true);
  // }

  mainWindow.on("closed", () => mainWindow = null);

  app.on('window-all-closed', () => {
    app.quit()
  });

}

electron.app.on("ready", createWindow);
