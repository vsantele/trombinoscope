const { app, BrowserWindow, Menu, shell } = require('electron');
const isDev = require('electron-is-dev')
const path = require('path')
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
require('update-electron-app')({
  repo: "wolfvic/trombinoscope",
  updateInterval: "1 hour"
})

// if(!isDev) {
//   autoUpdater.setFeedURL(feed)
//   setInterval(() => {
//     autoUpdater.checkForUpdates()
//   }, 60000)

//   autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//     const dialogOpt = {
//       type: 'info',
//       buttons: ['Redémarrer', 'Plus tard'],
//       title: 'Mise à jour de l\'application',
//       message: process.platform === "win32" ? releaseNotes : releaseName,
//       detail: 'Une nouvelle version a été téléchargé. Redémarrer l\'application pour appliquer les mises à jour.'
//     }

//     dialog.showMessageBox(dialogOpt, res => {
//       if (res === 0) autoUpdater.quitAndInstall()
//     })
//   })

//   autoUpdater.on('error', msg =>{
//     console.error('Il y a eu un problème lors de la mise à jour de l\'application')
//     console.error(msg)
//   })
// }

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if(isDev) mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

const exportData = () => {
  
}

const importData = combine => {
  if (combine) {

  } else {

  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  const template = [
    {
      label:'Base de données',
      submenu: [
        {
          label: 'Exporter',
          click: () => {
            exportData()
          }
        },
        {
          label: 'Importer et remplacer',
          click: () => {
            importData(false)
          }
        },
        {
          label: 'Importer et combiner',
          click: () => {
            importData(true)
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo'},
        { type:'separator'},
        {role: 'cut'},
        {role:'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role:'selectall'}
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
