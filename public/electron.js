const path = require('path');
const isDev = require('electron-is-dev');
const { BrowserWindow, app, globalShortcut } = require('electron');

const loadTemplate = isDev
? 'http://localhost:3000'
: `file://${path.join(__dirname, '../build/index.html')}`

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname,'icon.ico')
  });

  console.log(win)

  win.loadURL(
    loadTemplate
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  // console.log("asdasd")
  globalShortcut.register('CommandOrControl+N', () => {
    createWindow()
  })
  globalShortcut.register('CommandOrControl+Q', () => {
    app.quit()
  })
}).then(createWindow)

// app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.setUserTasks([
  {
    program: process.execPath,
    arguments: loadTemplate,
    iconPath: path.join(__dirname,'icon.ico'),
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
])