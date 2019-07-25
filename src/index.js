const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev')
const path = require('path')
const fs = require('fs')
const os = require('os')
const neDB = require('./neDB')
const log = require('electron-log')
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
let mainWindow, workerWindow;

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
    workerWindow = null
  });
};

const dlLog = () => {
  log.log('Dl Log')
  var logPath = dialog.showSaveDialog({
    title: 'Sauvegarde du Fichier log',
    filters: [{
      name: 'Text',
      extensions: ['txt']
    }]
  })
  if (logPath) {
    fs.copyFile(log.transports.file.findLogPath(),logPath, (err) => {
      if (err) {
        console.error('Erreur dl Log')
        console.error(err)
        log.error('Erreur dl Log') 
        log.error(err)
        mainWindow.webContents.send('sendSnack','Erreur sauvegarde log')
      }
    } )
  }
}

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
    // {
    //   label:'Base de données',
    //   submenu: [
    //     {
    //       label: 'Exporter',
    //       click: () => {
    //         exportData()
    //       },
    //       enabled: false
    //     },
    //     {
    //       label: 'Importer et remplacer',
    //       click: () => {
    //         importData(false)
    //       },
    //       enabled: false
    //     },
    //     {
    //       label: 'Importer et combiner',
    //       click: () => {
    //         importData(true)
    //       },
    //       enabled: false
    //     }
    //   ]
    // },
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
    },
    {
      label:'Aide',
      submenu: [
        {
          label: 'Télécharger logs',
          click: () => {
            dlLog()
          }
        },
        {
          'label' : 'Contact',
          click: () => {
            shell.openExternal('mailto:vic16@hotmail.be?subject=[Trombinoscope]')
          }
        }
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

ipcMain.on('printPDF', async (event, type, users) => {
  try {
    log.log('préparation print PDF')
    workerWindow = new BrowserWindow({show: false})
    // workerWindow.loadURL(`file://${__dirname}/worker.html`)
    // if(isDev) {
    //   workerWindow.webContents.openDevTools()
    // } else {
    //   workerWindow.hide()
    // }
    workerWindow.on("closed", () => {
      workerWindow = null;
    });
    workerWindow.loadURL(`file://${__dirname}/worker.html`)
    workerWindow.on('ready-to-show', () => {
      workerWindow.webContents.send('printPDF', type, users)
    })
    
  } catch (error) {
    log.error('Erreur ouverture worker')
    log.error(error)
    event.sender.send('sendSnack', "Erreur envoie information vers pdf")
  }

})

ipcMain.on('readyToPrintPDF', (event) => {
  log.log('PDF Prêt')
  let pdfPath
  if (isDev) {
    pdfPath = path.join(os.tmpdir(), 'print.pdf')
  } else {
    pdfPath = dialog.showSaveDialog({
      title: 'Sauvegarde du Fichier',
      filters: [{
        name: 'PDF',
        extensions: ['pdf']
      }]
    })
  }
  if (pdfPath) {
    const win = BrowserWindow.fromWebContents(event.sender)
    win.webContents.printToPDF({pageSize: 'A4', landscape: false, }, (error, data) => {
      if(error) {
        console.error(error.message)
        log.error('Erreur Print PDF')
        return log.error(error.message)
      }
      fs.writeFile(pdfPath, data, error => {
        if (error) {
          console.error(error.message)
          mainWindow.webContents.send('sendSnack', 'Erreur sauvegarde PDF')
          log.error('Erreur Sauvegarde PDF')
          return log.error(error.message)
        }
        log.log('fichier enregistré : ', pdfPath)
        shell.openExternal('file://'+pdfPath)
        event.sender.send('finish')
      })
    })
  }
})

ipcMain.on('ne-delId', async (event, id) => {
  try {
    event.returnValue = await neDB.delId(id)
    log.log('Suppression id: ', id)
  } catch (error) {
    log.error('Erreur Del Id')
    log.error(error) 
    event.sender.send('sendSnack', 'Erreur Suppression Membre')
  }
})

ipcMain.on('ne-readAll', async (event) => {
  try {
    event.returnValue = await neDB.readAll()
  } catch (error) {
    log.error('Erreur readAll')
    log.error(error)
    event.sender.send('sendSnack', 'Erreur Récupération Membre')
  }
})

ipcMain.on('ne-create', async (event, {name, photo, com}) => {
  try {
    await neDB.create(name, photo, com)
  } catch (error) {
    log.error('Erreur Création Membre')
    log.error(error)
    event.sender.send('sendSnack', 'Erreur Création Membre')
  }
})

ipcMain.on('ne-update', async (event, {id, name, photo, com}) => {
  try {
    await neDB.update(id, name, photo, com)
  } catch (error) {
    log.error('Erreur MAJ Membre')
    log.error(error)
    event.sender.send('sendSnack', 'Erreur Mise à Jour Membre')
  }
})
