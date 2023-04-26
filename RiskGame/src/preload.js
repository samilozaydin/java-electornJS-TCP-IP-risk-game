/*const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
      sendMessage: (myJson) => ipcRenderer.invoke('sendMessage', myJson),
      receiveMessage: () => ipcRenderer.invoke('receiveMessage'),
      connectToServer: () => ipcRenderer.invoke('connectToServer')

    // we can also expose variables, not just functions
})*/
/*
ipcRenderer.on('receiveMessage', (_event, arg) => {
    console.log(arg) // prints "pong" in the DevTools console
});
ipcRenderer.send('sendMessage', 'ping');
*/