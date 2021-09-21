const { BrowserWindow, Menu, Tray, app } = require("electron")
const config = require("./config.json")

let tray = null
let WindowSettings

function Client() {
  WindowSettings = new BrowserWindow({
    width: 1200, height: 780,
    minHeight: 560, minWidth: 650,
    show: false,
    center: true,
    resizable: true,
    title: config.title,
    icon: `${__dirname}/${config.icon}`,
    webPreferences: {
      devTools: true
    }
  })


  WindowSettings.loadURL(config.url)

  WindowSettings.setMenu(null)

  WindowSettings.on('close', (event) => {
    if (app.quitting) {
      WindowSettings = null
    } else {
      event.preventDefault()
      WindowSettings.hide()
    }
  })
  WindowSettings.on("ready-to-show", async() => {
    WindowSettings.show()
  })
}

app.on("ready", () => {
  Client()
  buildTray()
})

const sameInstance = app.requestSingleInstanceLock()

if (!sameInstance) {
  app.quit()
  WindowSettings.show()
} else {
  app.on('second-instance', () => {
    if (WindowSettings) {
      if (WindowSettings.isMinimized()) WindowSettings.restore()
      WindowSettings.focus()
    }
  })
}

function buildTray() {
  tray = new Tray(`${__dirname}/${config.icon}`)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: config.title,
      click: function () {
        app.quit()
      }
    }
  ])

  tray.setToolTip(config.title)
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    WindowSettings.show()
  })
}

app.on('window-all-closed', function (event) {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  app.on('activate', () => { WindowSettings.show() })
})

app.on('before-quit', () => app.quitting = true)