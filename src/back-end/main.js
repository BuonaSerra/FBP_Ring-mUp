const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.maximize();

  //SERIAL START code from Electron example https://www.electronjs.org/docs/latest/tutorial/devices#web-serial-api

  mainWindow.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {
    // Add listeners to handle ports being added or removed before the callback for `select-serial-port`
    // is called.
    mainWindow.webContents.session.on('serial-port-added', (event, port) => {
      console.log('serial-port-added FIRED WITH', port)
      // Optionally update portList to add the new port
    })

    mainWindow.webContents.session.on('serial-port-removed', (event, port) => {
      console.log('serial-port-removed FIRED WITH', port)
      // Optionally update portList to remove the port
    })

    event.preventDefault()
    if (portList && portList.length > 0) {
      callback(portList[0].portId)
    } else {
      // eslint-disable-next-line n/no-callback-literal
      callback('') // Could not find any matching devices
    }
  })

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'serial' ) { //&& details.securityOrigin === 'file:///'
      return true
    }

    return false
  })

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'serial' ) { //&& details.origin === 'file://'
      return true
    }

    return false
  })

  //SERIAL STOP


  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async() => {
  createWindow();
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
