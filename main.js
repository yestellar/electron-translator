require('v8-compile-cache')
const {
    app, 
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem,
    globalShortcut
} = require('electron')

const fs = require('fs')
const path = require('path')
const translateText = require('./lib/translateText')
const clipboardy = require('clipboardy')

const isMac = process.platform === 'darwin'
const menuTemplate = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
        }] : []),
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'delete' },
                { role: 'selectall' }
            ]
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Translate ' + isMac ? '(Command+Shift+V)' : '(Ctrl+Shift+V)',
                    click: () => {
                        mainWindow.show();
                        mainWindow.webContents.send('translate_copied', clipboardy.readSync())
                    }
                }
            ]
        }

]

let mainWindow = null;

app.setName('English Dictionary')

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
    
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

    const ctxMenu = new Menu()
    ctxMenu.append(new MenuItem({
        label: 'Archive selected',
        click: () => {
            mainWindow.webContents.send('archive_selected')
        }
    }))

    globalShortcut.register('CommandOrControl+Shift+V', () => {
        mainWindow.show();
        mainWindow.webContents.send('translate_copied', clipboardy.readSync())
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('closed', () => {
        mainWindow = null;
    })

    mainWindow.webContents.openDevTools()
    mainWindow.webContents.on('context-menu', (e, props) => {
        ctxMenu.popup(mainWindow, props.x, props.y)
    })
}

app.on('ready', createWindow)

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})

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
