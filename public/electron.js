const path = require('path');
const electron = require('electron');
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const isDev = require('electron-is-dev');

const loadTemplate = isDev
? 'http://localhost:3000'
: `file://${path.join(__dirname, '../build/index.html')}`

function createWindow() {
  // Create the browser window.
  // const appIcon = new Tray('../assets/images/logo.png')
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

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    loadTemplate
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools();
  }

  // win.setOverlayIcon(path.join(__dirname, '../assets/images/logo.png'), 'Overlay Icon Description');
    
  // setTimeout(() => {
  //     win.setOverlayIcon(null, '');
  // }, 5000);

  // win.setThumbarButtons([
  //   {
  //     tooltip: 'cat 1',
  //     icon: path.join(__dirname, '../assets/images/logo.png'),
  //     click() { console.log('cat 1 clicked') }
  //   }, {
  //     tooltip: 'cat 2',
  //     // icon: path.join(__dirname, 'cat.jpg'),
  //     flags: ['enabled', 'dismissonclick'],
  //     click() { console.log('cat 2 clicked.') }
  //   }
  // ])
}

// app.whenReady().then(() => {
//   globalShortcut.register('Alt+CommandOrControl+I', () => {
//     console.log('Electron loves global shortcuts!')
//   })
// }).then(createWindow)

app.whenReady().then(createWindow)

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