const func = async () => {
    const response = await window.versions.sendMessage();
    console.log(response); // prints out 'pong'
}
myJson = {
    processType: "1"
}
mybutton.addEventListener("click", async () => {
    const response = await window.versions.receiveMessage();
    console.log(response); // prints out 'pong'
})

sendbutton.addEventListener("click", async (e) => {
    console.log(myJson)
    const response = await window.versions.sendMessage(myJson);
    console.log(response); // prints out 'pong'
})
async function start() {
    await window.versions.connectToServer();
}
start();