const { BrowserWindow } = require("electron")
const WinState = require("electron-win-state").default
const path = require("path")
const isDev = require('electron-is-dev')
const { handleIPC } = require('./ipcHandle')

let mainWind
const createWind = () => {
  const winState = new WinState({
    defaultWidth: 414,
    defaultHeight: 896
  })
  mainWind = new BrowserWindow({
    ...winState.winOptions,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
    },
  })
  if (isDev) {
    mainWind.loadURL('http://192.168.60.199:5175')
    mainWind.webContents.openDevTools()
  } else {
    // mainWind.loadFile()
  }
  mainWind.once('ready-to-show', () => {
    mainWind.show()
  })
  winState.manage(mainWind)
  handleIPC()
}
const sendMainWind = (channel, ...args) => {
  mainWind.webContents.send(channel, ...args)
}

module.exports = { createWind, sendMainWind }