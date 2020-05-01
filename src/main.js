import electron from 'electron'
import path from 'path'
import url from 'url'

const { app, BrowserWindow } = electron

app.commandLine.appendSwitch("--enable-unsafe-webgpu");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, '..', 'public', 'index.html'),
            protocol: 'file:',
            slashes: true,
        })
    )

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})