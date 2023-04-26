const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const net = require('net');

const client = new net.Socket();


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 1024,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },

  });

  // and load the index.html of the app.
  /*ipcMain.handle('sendMessage', (e, myJson) => {
    function bb() {
      console.log("data is received before process")
      let data = client.read();
      console.log("ikinci sektor" + data);
      console.log("data is received")
      return data;
    }

    console.log(myJson)
    const writeJson = JSON.stringify(myJson);
    console.log("writeJson == " + writeJson)
    client.write(writeJson);
    console.log("data is written")
    let data = bb();
    return data;
  });

  ipcMain.handle('receiveMessage', () => {
    var data = client.read();
    console.log("gelindi " + data);
    return data;
  });

  ipcMain.handle('connectToServer', () => {
    client.connect(8080, 'localhost', () => {
      console.log('connected to server');
    });
  });*/
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

/*
ipcMain.on('sendMessage', (event, arg) => {
  console.log(arg) // prints "ping" in the Node console
  // works like `send`, but returning a message back
  // to the renderer that sent the original message
  event.reply('receiveMessage', 'pong')
})*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


/*if (typeof window !== 'undefined') {
  // 👉️ can use document here
  console.log('You are on the browser')

  console.log(document.title)
  console.log(document.getElementsByClassName('my-class'));
} else {
  // 👉️ can't use document here
  console.log('You are on the server')
}*/



/*if (typeof document !== "undefined") {
  // document exists
  console.log("fsafsa");
} else {
  console.log("not");
  // document does not exist
}*/

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
