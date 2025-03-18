const { app, BrowserWindow, ipcMain, dialog } = require('electron')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // Habilita o acesso direto ao objeto "window" no contexto da página renderizada
    }
  })

  mainWindow.loadFile('index.html')

  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]
    }

    return null
  })
}

app.whenReady().then(createWindow)
