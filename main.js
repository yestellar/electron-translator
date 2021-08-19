const {
    app, 
    BrowserWindow,
    ipcMain
} = require('electron')

const url  = require('url')
const fs = require('fs')
const path = require('path')
const translateText = require('./lib/translateText')

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        show: false,
        icon: path.join(__dirname, 'assets/icon.png'),
        title: 'English Dictionary'
    })

    mainWindow.loadURL(path.join('file://', __dirname, 'windows/index.html'))

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('closed', () => {
        mainWindow = null;
    })

    mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

ipcMain.on('get_dictionary_request', (event) => {
    const dictionary = fs.readFileSync(path.join(__dirname, 'assets/dictionary.json'), 'utf8')
    event.sender.send('get_dictionary_response', dictionary)
})

ipcMain.on('update_dictionary', (event, dictionary) => {
    fs.writeFileSync(path.join(__dirname, 'assets/dictionary.json'), dictionary)
})

ipcMain.on('search_translation_request', async (event, text) => {
    try {
        const { data } = await translateText(text)
        const translation = data.translated_text.ru
        event.sender.send('search_translation_response', translation)
    } catch (e) {
        console.log(e)
    }
})
