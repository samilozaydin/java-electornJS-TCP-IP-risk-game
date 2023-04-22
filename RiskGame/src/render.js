

/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*--------------- Connection ----------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/

const net = require('net');

const client = new net.Socket();
const mybutton = document.getElementById("mybutton");
const sendbutton = document.getElementById("sendbutton");

myJson = {
    processType: ""
}
/* MESSAGE TYPES

processType : the process will be executed.
- 1: create a session
- 2: send to client

*/

client.connect(8080, 'localhost', () => {
    console.log('connected to server');
});


mybutton.addEventListener("click", () => {
    const mytext = document.getElementById("mytext");
    console.log("data is received")
    mytext.innerHTML = client.read();
    console.log("data is received")
})
function bb() {
    const mytext = document.getElementById("mytext");
    console.log("data is received before process")
    mytext.innerHTML = client.read();
    console.log("data is received")
}
sendbutton.addEventListener("click", () => {
    const writeJson = JSON.stringify(myJson);
    client.write(writeJson);
    console.log("data is written")
    bb();
})

/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*--------------- Configurations ------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 600;


/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*----------------- Classes -----------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/

class Button {

    constructor(img, x, y, width, height) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*------------------ GAME -------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/

// Load images

const btn_play = new Image();
btn_play.src = "./images/btn_play.png";
const img_background = new Image();
img_background.src = "./images/background.jpg";
const btn_next = new Image();
btn_next.src = "./images/btn_next.png";
const btn_previous = new Image();
btn_previous.src = "./images/btn_previous.png";
const btn_exit = new Image();
btn_exit.src = "./images/btn_exit.png";

//click event is created
var mouseX = -1;
var mouseY = -1;
canvas.addEventListener("mousedown", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    console.log(mouseX)
    console.log(mouseY)
});

//global parameter
var parameter = {};

//control variables
isSessionCreated = false;

const colors = {
    "black": "#000000",
    "waiting_box": "#A55240"
}
const functions = {
    "main_menu": main_menu,
    "waiting_menu": waiting_menu,
    "waiting_for_player": waiting_for_player
}
var funcSelection = "main_menu";

function game_loop() {
    let currentFunc = functions[funcSelection];
    currentFunc();

    requestAnimationFrame(game_loop);
}

function main_menu() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(img_background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ply_btn = new Button(btn_play, CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2 + 25, 200, 200);
    ply_btn.draw(ctx);

    if (mouseX > ply_btn.x && mouseX < ply_btn.x + ply_btn.width
        && mouseY > ply_btn.y && mouseY < ply_btn.y + ply_btn.height) {
        funcSelection = "waiting_menu";
        console.log("play button executed");


    }
    mouseReset();
}

function waiting_menu() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(img_background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _btn_next = new Button(btn_previous, CANVAS_WIDTH / 4 - 75, CANVAS_HEIGHT / 2 + 150, 100, 100);
    _btn_next.draw(ctx);
    _btn_previous = new Button(btn_next, CANVAS_WIDTH * 3 / 4 - 50, CANVAS_HEIGHT / 2 + 150, 100, 100);
    _btn_previous.draw(ctx);
    _btn_exit = new Button(btn_exit, CANVAS_WIDTH / 2 - 40, CANVAS_HEIGHT / 2 + 165, 75, 75);
    _btn_exit.draw(ctx);
    rep_btn_create = new Button(null, CANVAS_WIDTH / 2 + 100, CANVAS_HEIGHT / 2 + 85, 100, 50);

    const buttons = {
        "next": _btn_next,
        "main_menu": _btn_exit,
        "previous": _btn_previous,
        "waiting_for_player": rep_btn_create
    };
    //parameter = buttons;


    ctx.fillStyle = colors["waiting_box"];
    ctx.roundRect(CANVAS_WIDTH / 4 - 100, CANVAS_HEIGHT / 4 - 50, 565, 350, 15);
    ctx.fill();
    ctx.fillStyle = colors["black"];
    ctx.fillRect(CANVAS_WIDTH / 2 + 100, CANVAS_HEIGHT / 2 + 85, 100, 50);
    ctx.fillStyle = colors["waiting_box"];
    ctx.fillRect(CANVAS_WIDTH / 2 + 105, CANVAS_HEIGHT / 2 + 90, 90, 40);
    ctx.fillStyle = colors["black"];
    ctx.font = "16px serif";
    ctx.fillText("Create Game", CANVAS_WIDTH / 2 + 108, CANVAS_HEIGHT / 2 + 115);

    selection = "";
    Object.entries(buttons)
        .forEach((key, value) => {
            //console.log(key[1].x);
            //console.log(key[value])
            if (mouseX > key[1].x && mouseX < key[1].x + key[1].width
                && mouseY > key[1].y && mouseY < key[1].y + key[1].height) {
                funcSelection = key[0];
                // console.log("exit selected")
            }
        })
    //console.log("Buraya gelindi");
    mouseReset();
}

function mouseReset() {
    mouseX = -1;
    mouseY = -1;
}

function waiting_for_player() {
    if (!isSessionCreated) {
        isSessionCreated = true;

        sendMessage(processType = "1");
        receiveMessage();

    }
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(img_background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function sendMessage(processType) {
    myJson["processType"] = processType;
    const writeJson = JSON.stringify(myJson);
    client.write(writeJson);
    console.log(processType);
    console.log("data is written");
}

function receiveMessage() {
    receivedData = client.read();
    console.log(receivedData);
    receivedJSON = JSON.parse(receivedData);

    myJson = {}
    myJson["name"] = receivedJSON["name"];

    console.log(myJson["name"]);
    console.log("data is received")
}

//game_loop();
