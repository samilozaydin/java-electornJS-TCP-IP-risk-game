

/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*--------------- Connection ----------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/

const { remote } = require('electron');
const net = require('net');

const client = new net.Socket();
const mybutton = document.getElementById("mybutton");
const sendbutton = document.getElementById("sendbutton");
const riskgame = document.getElementById("riskgame");
const mymainmenu = document.getElementById("main_menu");
const emptyButton = document.getElementById("main_menu_empty_button");


const mywaiting_menu = document.createElement("div");
mywaiting_menu.id = "waiting-menu";
const sessionsDiv = document.createElement("div");
sessionsDiv.className = "sessions";
const sessionContainer = document.createElement("div");
sessionContainer.className = "container_session_button";
const horizontaButtons = document.createElement("div");
horizontaButtons.className = "horizontal-buttons";

mywaiting_menu.appendChild(sessionsDiv);
mywaiting_menu.appendChild(sessionContainer);
mywaiting_menu.style.display = "none";
horizontaButtons.style.display = "none";
mymainmenu.appendChild(mywaiting_menu);
mymainmenu.appendChild(horizontaButtons);
//console.log(newDiv.innerHTML + "bla " + newDiv.innerText + " html:" + newDiv.outerHTML);

//main menu
const plybtn = document.getElementById("ply_btn");// the play button event
plybtn.onclick = () => {
    //getSessions();
    //console.log("play button executed");
    getSessions();

    /*riskgame.innerHTML =
        `<div id="main_menu" class="menu-background">
                <div id="waiting-menu">
                    <div class="sessions"></div>
                    <div class="container_session_button">
                    </div>
                </div>
            
                <div class="horizontal-buttons">
            </div>
        </div>
                `;*/

    mywaiting_menu.style.display = "block";
    horizontaButtons.style.display = "block";

    plybtn.style.display = "none";
    emptyButton.style.display = "none";
    // console.log(receivedJSON);
    // console.log("geldi")

    /* var horizontal_buttons = document.getElementsByClassName("horizontal-buttons")[0];
     horizontal_buttons.appendChild(button_previous);
     horizontal_buttons.appendChild(button_exit);
     horizontal_buttons.appendChild(button_next);
 
 
     sessionInput.id = "session_name"
     sessionInput.type = "text";
     sessionInput.placeholder = "Session Name";
     document.getElementsByClassName("container_session_button")[0].appendChild(sessionInput);
     document.getElementsByClassName("container_session_button")[0].appendChild(button_add_session);
     var fillerDiv = document.createElement("div");
     fillerDiv.style = "width:50px";
     document.getElementsByClassName("container_session_button")[0].appendChild(fillerDiv);*/

}

//######################Session Lobby Section#######################

const button_previous = document.createElement("img");
button_previous.className = "btn_lobby_arrow";
button_previous.src = "images/btn_previous.png";
button_previous.onclick = () => {
    console.log("previous")

};
const button_exit = document.createElement("img");
button_exit.id = "btn_exit";
button_exit.src = "images/btn_exit.png";
button_exit.onclick = () => {

    /* riskgame.innerHTML = `
     <div id="main_menu" class="menu-background">
     <div id="main_menu_empty_button"></div>
     </div>`;
     document.getElementById("main_menu").appendChild(plybtn);*/
    mywaiting_menu.style.display = "none";
    horizontaButtons.style.display = "none";
    plybtn.style.display = "block";
    emptyButton.style.display = "block";
};
const button_next = document.createElement("img");
button_next.className = "btn_lobby_arrow";
button_next.src = "images/btn_next.png";
button_next.onclick = () => {
    console.log("next")

};
var sessionInput = document.createElement("input");
const button_add_session = document.createElement("img");
button_add_session.id = "btn_add_session";
button_add_session.src = "images/btn_add_session.png";
button_add_session.onclick = () => {
    console.log("addsession")
    myJson["sessionName"] = sessionInput.value;

    sendMessage(processType = "1");
    document.body.appendChild(mymainmenu);
    mymainmenu.style.display = "none";
    riskgame.innerHTML = "Waiting for a player";

};


var horizontal_buttons = document.getElementsByClassName("horizontal-buttons")[0];
horizontal_buttons.appendChild(button_previous);
horizontal_buttons.appendChild(button_exit);
horizontal_buttons.appendChild(button_next);

sessionInput.id = "session_name"
sessionInput.type = "text";
sessionInput.placeholder = "Session Name";
document.getElementsByClassName("container_session_button")[0].appendChild(sessionInput);
document.getElementsByClassName("container_session_button")[0].appendChild(button_add_session);
var fillerDiv = document.createElement("div");
fillerDiv.style = "width:50px";
document.getElementsByClassName("container_session_button")[0].appendChild(fillerDiv);

// this is sender and receiver json.
myJson = {
    processType: ""
};
receivedJSON = {

};
//executed function when there is a call. 
const receivedFunctions = {
    "1": emptyCall,
    "2": emptyCall,
    "3": putSessions,
    "5": startGame,
    "8": updatePlayer,
    "10": endTurnReceivedServer
}

const READ_BUFFER_SIZE = 1024;
/* MESSAGE TYPES

processType : the process will be executed.
- 1: create a session
- 2: send to client
- 3: send session // server side message
- 4: add player to session// server side
- 5: start game
- 6: end connections
- 7: next-section
- 8: update-player
- 9: empty call to server
- 10: end player turn
*/

//16.16.173.201
client.connect(5050, 'localhost', () => {
    console.log('connected to server');
});

client.on("data", (data) => {
    let receivedData = data;
    //console.log(data);
    receivedJSON = JSON.parse(receivedData);
    //console.log(receivedJSON);
    console.log("data is received");
    // console.log(receivedJSON["processType"]);
    let executed = receivedFunctions[receivedJSON["processType"]];
    executed();
});
client.on('close', () => {
    console.log('TCP connection disconnected');
});
client.on('end', () => {
    console.log('TCP connection disconnected');
});

function putSessions() {// sort all the session to screen.

    //console.log("executed");

    Object.entries(receivedJSON).forEach(([key, value], index, arr) => {
        let sessionDiv = document.createElement("div");

        if (key.includes("session_")) {
            sessionDiv.className = "session";
            sessionDiv.id = value["sessionId"];
            sessionDiv.name = value["sessionTotalPlayer"];
            sessionDiv.innerText = "Room name= " + value["sessionName"];
            sessionDiv.innerText = sessionDiv.innerText + " Total player= " + value["sessionTotalPlayer"] + "/2"
            document.getElementsByClassName("sessions")[0].appendChild(sessionDiv);

            sessionDiv.onclick = () => {
                myJson = {};
                myJson["sessionId"] = sessionDiv.id;
                if (sessionDiv.name.includes("2")) {
                    console.log("this room is full");
                    return;
                }
                var shuffle = generateUniqueNumbers(0, 41);
                gamePawns = fillPawns(gamePawns, shuffle);
                myJson["gamePawns"] = gamePawns;

                myJson["troopsAmounts"] = troopsAmounts;
                // console.log(myJson)
                sendMessage(processType = "4")
                //  console.log(sessionDiv.name);
            };
        }

        // console.log(key);
        //console.log(value);
        // console.log(arr);
    });
}
function updatePlayer() {// update player screen
    gamePawns = receivedJSON["gamePawns"];
    troopsAmounts = receivedJSON["troopsAmounts"];
    playerTurn = receivedJSON["playerTurn"];
    gameMode = receivedJSON["gameMode"];
    putTroops(gamePawnsDiv, troopsAmounts);
    colorPawns(gamePawns, gamePawnsDiv);
    whoseTurn();
    winCheck();

}
function endTurnReceivedServer() {// when turn is over, players screen is updated accordingly.
    gamePawns = receivedJSON["gamePawns"];
    troopsAmounts = receivedJSON["troopsAmounts"];
    playerTurn = receivedJSON["playerTurn"];
    gameMode = receivedJSON["gameMode"];
    putTroops(gamePawnsDiv, troopsAmounts);
    colorPawns(gamePawns, gamePawnsDiv);
    whoseTurn();
    clear(gamePawnsDiv);

    if (playerTurn == player) {
        feedPawnsForModuleMenu(gamePawnsDiv, gamePawns);
        deploymentSection();
        deployAmount = 5;
    }
    regionCheck(gamePawns, regions, player);
}
function emptyCall() {// empty call for necessery situations

}
function startGame() { // session is started.
    gamePawns = receivedJSON["gamePawns"];
    player = receivedJSON["player"];
    //  console.log(player);
    //  console.log(troopsAmounts);
    troopsAmounts = receivedJSON["troopsAmounts"];
    // console.log(troopsAmounts);

    colorPawns(gamePawns, gamePawnsDiv);
    putTroops(gamePawnsDiv, troopsAmounts);

    regionCheck(gamePawns, regions, player);
    deploymentSection();
    clear(gamePawnsDiv);
    if (player == playerTurn)
        feedPawnsForModuleMenu(gamePawnsDiv, gamePawns);
    whoseTurn();
    riskgame.innerHTML = "";
    riskgame.appendChild(gameboard);
    gameboard.style.display = "block";
    if (player == 1)
        sendMessage(processType = "9");
}

/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*--------------- Configurations ------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/

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
const btn_add_session = new Image();
btn_add_session.src = "./images/btn_add_Session.png";

//global parameter
var parameter = {};
var sessionPage = 1;
var maxSessionInPage = 5;


//control variables
isSessionCreated = false;

const colors = {
    "black": "#000000",
    "waiting_box": "#A55240",
    "session_box": "#FFDBAC"
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
    ply_btn.draw(ctx);

    if (mouseX > ply_btn.x && mouseX < ply_btn.x + ply_btn.width
        && mouseY > ply_btn.y && mouseY < ply_btn.y + ply_btn.height) {
        getSessions();
        funcSelection = "waiting_menu";
        console.log("play button executed");


    }
    mouseReset();
}

function waiting_menu() {

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(img_background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _btn_next.draw(ctx);
    _btn_previous.draw(ctx);
    _btn_exit.draw(ctx);

    ctx.fillStyle = colors["waiting_box"];
    ctx.roundRect(CANVAS_WIDTH / 4 - 100, CANVAS_HEIGHT / 4 - 50, 565, 350, 15);
    ctx.fill();

    _btn_create.draw(ctx);

    const buttons = {
        "next": _btn_next,
        "main_menu": _btn_exit,
        "previous": _btn_previous,
        "waiting_for_player": _btn_create
    };
    //parameter = buttons;

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
        });
    //console.log("Buraya gelindi");
    mouseReset();
}

function mouseReset() {
    mouseX = -1;
    mouseY = -1;
}
function getSessions() {
    sendMessage(processType = "3")
}

function waiting_for_player() {
    if (!isSessionCreated) {
        isSessionCreated = true;

        let sendJSON = {
            processType: "1"
        }

        sendMessage(sendJSON);
        //receiveMessage();

    }
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(img_background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function sendMessage(processType) {
    myJson["processType"] = processType;
    const writeJson = JSON.stringify(myJson);
    client.write(writeJson);
    //console.log(processType);
    console.log("data is written");
}

/*AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaaaaaaaaaAAAAAAAAAA*/

// Create the main gameboard element
const gameboard = document.createElement('div');
gameboard.id = 'gameboard';
gameboard.classList.add('game-board');

// Array of pawn numbers
const pawnNumbers = Array.from({ length: 42 }, (_, i) => i);

// Create the pawn elements
pawnNumbers.forEach(number => {
    const pawn = document.createElement('div');
    pawn.id = `pawn_${number}`;
    pawn.classList.add('pawns', 'blue-pawns');
    pawn.textContent = number;

    gameboard.appendChild(pawn);
});

// Create the line elements
for (let i = 0; i < 79; i++) {
    const line = document.createElement('div');
    line.id = `line_${i}`;
    line.classList.add('line');

    // Add appropriate class based on region
    if (i < 16) {
        line.classList.add('northern-america');
    } else if (i === 16) {
        line.classList.add('bridge-line');
    } else if (i < 22) {
        line.classList.add('southern-america');
    } else if (i < 32) {
        line.classList.add('africa');
    } else if (i < 36) {
        line.classList.add('bridge-line');
    } else if (i < 47) {
        line.classList.add('europe');
    } else if (i < 51) {
        line.classList.add('bridge-line');
    } else if (i < 71) {
        line.classList.add('asia');
    } else if (i == 71 || i == 77 || i == 78) {
        line.classList.add('bridge-line');
    } else {
        line.classList.add('australia');
    }

    gameboard.appendChild(line);
}

// Create other elements
const moduleWrapper = document.createElement('div');
moduleWrapper.classList.add('module-wrapper');

const moduleMenu = document.createElement('div');
moduleMenu.classList.add('module-menu');

const plus = document.createElement('div');
plus.id = 'plus';
plus.textContent = '+';
moduleMenu.appendChild(plus);

const minus = document.createElement('div');
minus.id = 'minus';
minus.textContent = '-';
moduleMenu.appendChild(minus);

moduleWrapper.appendChild(moduleMenu);
gameboard.appendChild(moduleWrapper);

const moduleWrapperAttack = document.createElement('div');
moduleWrapperAttack.classList.add('module-wrapper-attack');

const moduleAttack = document.createElement('div');
moduleAttack.classList.add('module-attack');

const btnAttack = document.createElement('div');
btnAttack.id = 'btn-attack';
btnAttack.textContent = 'Attack';
moduleAttack.appendChild(btnAttack);

moduleWrapperAttack.appendChild(moduleAttack);
gameboard.appendChild(moduleWrapperAttack);

const firstBlue = createDiceElement('firstblue', '1', "blue");
const secondBlue = createDiceElement('secondblue', '1', "blue");
const firstRed = createDiceElement('firstred', '1', "red");
const secondRed = createDiceElement('secondred', '1', "red");

gameboard.appendChild(firstBlue);
gameboard.appendChild(secondBlue);
gameboard.appendChild(firstRed);
gameboard.appendChild(secondRed);

const turnTroops = document.createElement('div');
turnTroops.classList.add('turn-troops');
turnTroops.textContent = '5';
gameboard.appendChild(turnTroops);

const nextSection = document.createElement('div');
nextSection.classList.add('next-section');
nextSection.textContent = 'Next Section';
gameboard.appendChild(nextSection);

const sectionIndicator = document.createElement('div');
sectionIndicator.classList.add('section-indicator');
sectionIndicator.textContent = 'Deploy';
gameboard.appendChild(sectionIndicator);

const whosTurn = document.createElement('div');
whosTurn.classList.add('whos-turn');
gameboard.appendChild(whosTurn);

// Helper function to create dice elements
function createDiceElement(id, value, color) {
    const dice = document.createElement('div');
    dice.id = id;
    if (color.includes("red")) {
        dice.classList.add('dice', 'red');
    } else {
        dice.classList.add('dice', 'blue');

    }
    const p = document.createElement('p');
    p.id = `${id}P`;
    p.textContent = value;

    dice.appendChild(p);
    return dice;
}

// Append the gameboard to the document body
gameboard.style.display = 'none';
document.body.appendChild(gameboard);

/*AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA- Game Section-AAAAAAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaaaaaaaaaAAAAAAAAAA*/

function generateUniqueNumbers(start, end) {
    // Create an array with numbers from start to end
    const numbers = [];
    for (let i = start; i <= end; i++) {
        numbers.push(i);
    }

    // Shuffle the array using Fisher-Yates algorithm
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers;
}
function fillPawns(pawns, shuffled) { //fill the pawns with player who captures.
    for (var i = 0; i < pawns.length; i++) {
        (i % 2 == 0) ? pawns[shuffled[i]] = 1 : pawns[shuffled[i]] = 2;
    }
    return pawns;
}
function colorPawns(pawns, pawnDocs) { //give color to the pawn accarding to who have them.
    for (var i = 0; i < pawns.length; i++) {
        (pawns[i] == 1) ? pawnDocs[i].className = "pawns red-pawns" :
            pawnDocs[i].className = "pawns blue-pawns";
    }
}
function assignSoldiers(pawns, pawnsDoc, totalSoldier) {// assign soldiers to pawn according to game mmeory.
    let p1Total = totalSoldier - pawns.length / 2;
    let p2Total = totalSoldier - pawns.length / 2;

    for (var i = 0; i < pawnsDoc.length; i++) {
        pawnsDoc[i].innerText = "1";
    }

    var shuffled = generateUniqueNumbers(0, 41);
    for (var i = 0; p1Total > 0 || p2Total > 0; i++) {
        var rand = Math.floor(Math.random() * 5);
        if (pawns[shuffled[i % 42]] == 1 && p1Total > 0) {
            if (p1Total < rand) {
                troopsAmounts[shuffled[i % 42]] += p1Total;
                pawnsDoc[shuffled[i % 42]].innerText = "" + (new Number(pawnsDoc[shuffled[i % 42]].innerText) + p1Total)
            } else {
                troopsAmounts[shuffled[i % 42]] += rand;

                pawnsDoc[shuffled[i % 42]].innerText = "" + (new Number(pawnsDoc[shuffled[i % 42]].innerText) + rand)
            }
            p1Total -= rand;

        } else if (pawns[shuffled[i % 42]] == 2 && p2Total > 0) {
            if (p2Total < rand) {
                troopsAmounts[shuffled[i % 42]] += p2Total;

                pawnsDoc[shuffled[i % 42]].innerText = "" + (new Number(pawnsDoc[shuffled[i % 42]].innerText) + p2Total)
            } else {
                pawnsDoc[shuffled[i % 42]].innerText = "" + (new Number(pawnsDoc[shuffled[i % 42]].innerText) + rand)
                troopsAmounts[shuffled[i % 42]] += rand;

            }
            p2Total -= rand;

        }
    }
}
function putTroops(pawnsDoc, troopsAmounts) {
    for (var i = 0; i < pawnsDoc.length; i++) {
        pawnsDoc[i].innerText = troopsAmounts[i];
    }
}
function updateTroops(pawnsDoc, troopsAmounts) {
    for (var i = 0; i < pawnsDoc.length; i++) {
        troopsAmounts[i] = new Number(pawnsDoc[i].innerText);
    }
}
function regionCheck(gamePawns, regions, player) {
    var notPlayer = (player == 1) ? 2 : 1;
    const troopRewards = [9, 4, 7, 6, 12, 4];

    for (var i = 0; i < Object.keys(regions).length; i++) {
        var isCaptured = true;
        regions[i].forEach(element => {
            if (gamePawns[element] == notPlayer) {
                isCaptured = false;
            }
        });
        if (isCaptured) {
            deployAmount += troopRewards[i];

        }

    }
    document.getElementsByClassName("turn-troops")[0].innerText = deployAmount;
}
function winCheck() {
    var isAllSame = true;
    var before = gamePawns[0];
    for (var i = 0; i < gamePawns.length; i++) {
        if (before != gamePawns[i]) {
            isAllSame = false;
        }
    }
    if (isAllSame) {//return main menu
        var winner = gamePawns[0];
        document.body.appendChild(gameboard);
        gameboard.style.display = 'none';
        mymainmenu.style.display = " ";
        riskgame.appendChild(mymainmenu);
        mywaiting_menu.style.display = 'none';
        horizontaButtons.style.display = "none";
        plybtn.style.display = "";
        emptyButton.style.display = "";
        console.log("game is finished")
        mymainmenu.style.display = "";

    } else {
        console.log("game is not finished")

    }
}
function feedPawnsForModuleMenu(pawnDocs, pawns) {// create deployment elements.
    for (var i = 0; i < pawnDocs.length; i++) {
        if (pawns[i] == player) {
            pawnDocs[i].onclick = (e) => {
                //console.log("geldim")
                document.getElementsByClassName("module-wrapper")[0].classList.toggle("module-menu-activated");
                var moduleMenu = document.getElementsByClassName("module-menu");
                //console.log(e.srcElement.id.split("pawn_")[1]);
                // console.log(e.srcElement);
                // console.log(e);
                //var docElement = document.getElementsByClassName["pawns"][e.srcElement.id.split("pawn_")[1]];
                selectedPawn = e.target.id.split("pawn_")[1];
                selectedPawnSoldiers = e.target.innerText;
                //console.log(selectedPawn)
                moduleMenu[0].style.left = "" + (e.x + 50) + "px";
                moduleMenu[0].style.top = "" + e.y + "px";
                //console.log(moduleMenu[0].offsetLeft + " " + moduleMenu[0].style.top)
            };
        }
    }
}
function whoseTurn() {
    var whosturn = document.getElementsByClassName("whos-turn")[0];
    (playerTurn == player) ? whosturn.innerText = "Your Turn" : whosturn.innerText = "Rival Turn"
}
function deploymentSection() {// create deployment elements detail.
    document.getElementById("plus").onclick = (e) => {
        var troopAmountDiv = document.getElementsByClassName("turn-troops");
        var troopAmount = new Number(troopAmountDiv[0].innerText);
        var selectedPawnDiv = document.getElementById("pawn_" + selectedPawn);

        var selectedPawnAmount = new Number(selectedPawnDiv.innerText);

        if (troopAmount > 0) {
            troopAmount--;
            selectedPawnAmount++;
            (deployments[selectedPawn] == null) ? deployments[selectedPawn] = 1 : deployments[selectedPawn]++;
        }
        //console.log(deployments)
        troopAmountDiv[0].innerText = troopAmount;
        selectedPawnDiv.innerText = selectedPawnAmount;
        troopsAmounts[selectedPawn] = selectedPawnAmount;
    }

    document.getElementById("minus").onclick = (e) => {
        var troopAmountDiv = document.getElementsByClassName("turn-troops");
        var troopAmount = new Number(troopAmountDiv[0].innerText);
        var selectedPawnDiv = document.getElementById("pawn_" + selectedPawn);

        var selectedPawnAmount = new Number(selectedPawnDiv.innerText);

        if ((deployments[selectedPawn] != null && deployments[selectedPawn] != 0) && troopAmount < deployAmount) {
            troopAmount++;
            selectedPawnAmount--;
            deployments[selectedPawn]--;
        }
        troopAmountDiv[0].innerText = troopAmount;
        selectedPawnDiv.innerText = selectedPawnAmount;
        troopsAmounts[selectedPawn] = selectedPawnAmount;

    }
    document.getElementsByClassName("section-indicator")[0].innerText = "Deploy"
}
function attackSection() {// create attack section elements details.
    document.getElementById("btn-attack").onclick = (e) => {
        oldSelectedPawn = selectedPawn;
        for (var i = 0; i < gamePawnsDiv.length; i++) {
            gamePawnsDiv[i].onclick = (e) => {
                clear(gamePawnsDiv);
                feedPawnsForModuleAttack(gamePawnsDiv, gamePawns);
            };
        }

        for (var i = 0; i < neighbours[selectedPawn].length; i++) {
            if (gamePawns[neighbours[selectedPawn][i]] == player) {
                var element = document.getElementById("pawn_" + neighbours[selectedPawn][i]);
                if (new Number(element.innerText) < 2) {
                    continue;
                }
                isAttackSelected = true;
                element.style.boxShadow = "0px 0px 3px 4px rgb(247, 74, 11)";
                element.onclick = (e) => rollDice(e);
            }
        }
        var modulemenu = document.getElementsByClassName("module-wrapper-attack");
        if (modulemenu[0].classList.contains('module-menu-activated')) {
            modulemenu[0].classList.remove('module-menu-activated');
        }
    }

}
function rollDice(e) {
    selectedPawn = e.target.id.split("pawn_")[1];
    console.log("dice is rolled");
    var red1 = Math.floor((Math.random() * 6) + 1);
    var red2 = Math.floor((Math.random() * 6) + 1);
    var blue1 = Math.floor((Math.random() * 6) + 1);
    var blue2 = Math.floor((Math.random() * 6) + 1);

    document.getElementById("firstredP").innerText = red1;
    document.getElementById("secondredP").innerText = red2;
    document.getElementById("firstblueP").innerText = blue1;
    document.getElementById("secondblueP").innerText = blue2;

    var redResult = red1 + red2;
    var blueResult = blue1 + blue2;
    var result = redResult - blueResult;

    // console.log(selectedPawn);
    var blueTroopId = gamePawns[selectedPawn] == 2 ? selectedPawn : oldSelectedPawn;
    var blueTroop = new Number(document.getElementById("pawn_" + blueTroopId).innerText)
    var redTroopId = gamePawns[selectedPawn] == 1 ? selectedPawn : oldSelectedPawn;
    var redTroop = new Number(document.getElementById("pawn_" + redTroopId).innerText)
    var blueTroopDiv = document.getElementById("pawn_" + blueTroopId);
    var redTroopDiv = document.getElementById("pawn_" + redTroopId);
    if (result > 0) {

        // console.log(blueTroop)
        blueTroop -= result;
        blueTroopDiv.innerText = blueTroop;
        if (blueTroop <= 0 && player == 1) {

            blueTroopDiv.innerText = Math.floor(redTroop / 2);
            redTroop = Math.ceil(redTroop / 2);
            redTroopDiv.innerText = redTroop;
            gamePawns[blueTroopId] = 1;
            colorPawns(gamePawns, gamePawnsDiv);
        } else if (blueTroop <= 0 && player == 2) {
            //   console.log("blabla");
            blueTroopDiv.innerText = 1;
        }
    } else if (result < 0) {

        redTroop += result;
        redTroopDiv.innerText = redTroop;
        if (redTroop <= 0 && player == 2) {

            redTroopDiv.innerText = Math.floor(blueTroop / 2);
            blueTroop = Math.ceil(blueTroop / 2);
            blueTroopDiv.innerText = blueTroop;
            gamePawns[redTroopId] = 2;
            colorPawns(gamePawns, gamePawnsDiv);
        } else if (redTroop <= 0 && player == 1) {
            //    console.log("blabla");

            redTroopDiv.innerText = 1;
        }
    }

    updateTroops(gamePawnsDiv, troopsAmounts);
    winCheck();
    clear(gamePawnsDiv);
    feedPawnsForModuleAttack(gamePawnsDiv, gamePawns);

    sendingProcess();


}
function clear(pawnDocs) { // clear pawns events.
    for (var i = 0; i < pawnDocs.length; i++) {
        pawnDocs[i].onclick = (e) => { };
        pawnDocs[i].style.boxShadow = "0px 0px 5px 1px black";
    }
}
function feedPawnsForModuleAttack(pawnDocs, pawns) {//create attack section elements
    for (var i = 0; i < pawnDocs.length; i++) {
        if (pawns[i] != player) {
            pawnDocs[i].onclick = (e) => {
                //console.log("geldim")
                document.getElementsByClassName("module-wrapper-attack")[0].classList.toggle("module-menu-activated");
                var moduleAttack = document.getElementsByClassName("module-attack");
                //console.log(e.srcElement.id.split("pawn_")[1]);
                // console.log(e.srcElement);
                // console.log(e);
                //var docElement = document.getElementsByClassName["pawns"][e.srcElement.id.split("pawn_")[1]];
                selectedPawn = e.srcElement.id.split("pawn_")[1];
                selectedPawnSoldiers = e.srcElement.innerText;
                //console.log(selectedPawn)
                moduleAttack[0].style.left = "" + (e.x + 50) + "px";
                moduleAttack[0].style.top = "" + e.y + "px";
                //console.log(moduleAttack[0].offsetLeft + " " + moduleAttack[0].style.top)
            };
        }
    }
    document.getElementsByClassName("section-indicator")[0].innerText = "Attack"

}
function feedPawnsForFortify(pawnDocs, pawns) {// create fortify section elements and feed them with event.

    for (var i = 0; i < pawnDocs.length; i++) {
        if (pawns[i] == player) {
            pawnDocs[i].onclick = (e) => {
                e.target.style.boxShadow = "0px 0px 3px 4px rgb(247, 74, 11)";
                fortifySelectedAmount++;
                selectedPawn = e.target.id.split("pawn_")[1];
                oldSelectedPawn = selectedPawn;

                for (var i = 0; i < neighbours[selectedPawn].length; i++) {
                    if (gamePawns[neighbours[selectedPawn][i]] == player) {
                        var element = document.getElementById("pawn_" + neighbours[selectedPawn][i]);

                        element.style.boxShadow = "0px 0px 3px 4px rgb(15, 151, 52)";
                        element.onclick = (e) => {
                            selectedPawn = e.target.id.split("pawn_")[1];
                            document.getElementsByClassName("module-wrapper")[0].classList.toggle("module-menu-activated");
                            var moduleMenu = document.getElementsByClassName("module-menu");

                            moduleMenu[0].style.left = "" + (e.x + 50) + "px";
                            moduleMenu[0].style.top = "" + e.y + "px";

                            clear(gamePawnsDiv);
                            feedPawnsForFortify(gamePawnsDiv, gamePawns);
                        };
                    }
                }
            };
        }
    }

}
function fortifySection() {// fortify elements detail is created.
    document.getElementById("plus").onclick = (e) => {
        //var troopAmountDiv = document.getElementsByClassName("turn-troops");
        //var troopAmount = new Number(troopAmountDiv[0].innerText);
        var selectedPawnDiv = document.getElementById("pawn_" + selectedPawn);
        var selectedPawnAmount = new Number(selectedPawnDiv.innerText);
        var oldSelectedPawnDiv = document.getElementById("pawn_" + oldSelectedPawn);
        var oldSelectedPawnAmount = new Number(oldSelectedPawnDiv.innerText);
        if (oldSelectedPawnAmount > 1) {
            oldSelectedPawnAmount--;
            selectedPawnAmount++;
        }
        oldSelectedPawnDiv.innerText = oldSelectedPawnAmount;
        selectedPawnDiv.innerText = selectedPawnAmount;
        troopsAmounts[selectedPawn] = selectedPawnAmount;

        sendingProcess();

    }

    document.getElementById("minus").onclick = (e) => {
        //var troopAmountDiv = document.getElementsByClassName("turn-troops");
        //var troopAmount = new Number(troopAmountDiv[0].innerText);
        var selectedPawnDiv = document.getElementById("pawn_" + selectedPawn);
        var selectedPawnAmount = new Number(selectedPawnDiv.innerText);
        var oldSelectedPawnDiv = document.getElementById("pawn_" + oldSelectedPawn);
        var oldSelectedPawnAmount = new Number(oldSelectedPawnDiv.innerText);
        if (selectedPawnAmount > 1) {
            oldSelectedPawnAmount++;
            selectedPawnAmount--;
        }
        oldSelectedPawnDiv.innerText = oldSelectedPawnAmount;
        selectedPawnDiv.innerText = selectedPawnAmount;
        troopsAmounts[selectedPawn] = selectedPawnAmount;

        sendingProcess();

    }
    document.getElementsByClassName("section-indicator")[0].innerText = "Fortify";
}

function gameFlow() {
    gameMode++;
    if (gameMode == 1) {
        regionCheck(gamePawns, regions, player);
        deploymentSection();
        feedPawnsForModuleMenu(gamePawnsDiv, gamePawns);
        whoseTurn();

    } else if (gameMode == 2) {
        sendingProcess()

        var troops = new Number(document.getElementsByClassName("turn-troops")[0].innerText);
        if (troops != 0) {
            alert("Deploy your troops first.");
            gameMode--;
            return;
        }

        clear(gamePawnsDiv);
        deployments = {};

        feedPawnsForModuleAttack(gamePawnsDiv, gamePawns);
        attackSection();
    } else if (gameMode == 3) {
        sendingProcess()


        clear(gamePawnsDiv);
        fortifySection();
        feedPawnsForFortify(gamePawnsDiv, gamePawns);
    } else if (gameMode == 4) {
        sendingProcess(processType = "10");

    }
}
function sendingProcess(processType = "7") {// prepare sending message to client.
    myJson = {};
    myJson["processType"] = processType;
    myJson["gamePawns"] = gamePawns;
    myJson["troopsAmounts"] = troopsAmounts;
    myJson["gameMode"] = gameMode;
    sendMessage(processType);

}
document.getElementsByClassName("next-section")[0].onclick = () => gameFlow();

window.onclick = function (e) {
    if (!e.target.matches('#pawn_' + selectedPawn)
        && !e.target.matches('#plus') && !e.target.matches('#minus')) {
        var modulemenu = document.getElementsByClassName("module-wrapper");
        if (modulemenu[0].classList.contains('module-menu-activated')) {
            modulemenu[0].classList.remove('module-menu-activated');
        }
    }
    if (!e.target.matches('#pawn_' + selectedPawn)
        && !e.target.matches('#btn-attack')) {
        var modulemenu = document.getElementsByClassName("module-wrapper-attack");
        if (modulemenu[0].classList.contains('module-menu-activated')) {
            modulemenu[0].classList.remove('module-menu-activated');
        }
    }
}


var neighbours = {
    0: [1, 4, 33],
    1: [0, 4, 5, 2],
    2: [1, 3, 5, 6],
    3: [2, 14, 15],
    4: [0, 1, 5, 7],
    5: [1, 4, 7, 8, 6, 2],
    6: [2, 5, 8],
    7: [4, 5, 8, 9],
    8: [6, 5, 7, 9],
    9: [7, 8, 10],
    10: [9, 12, 11],
    11: [10, 12, 13, 22],
    12: [10, 11, 13],
    13: [11, 12],
    14: [3, 15, 16],
    15: [3, 14, 16, 19],
    16: [14, 15, 19, 17, 18],
    17: [16, 18],
    18: [16, 17, 19, 20, 21],
    19: [15, 16, 18, 20, 28, 29],
    20: [18, 19, 27, 28, 21, 26],
    21: [18, 20, 26, 22],
    22: [11, 21, 23, 26],
    23: [22, 24, 26],
    24: [23, 25, 26],
    25: [24, 26],
    26: [20, 21, 22, 23, 24, 25],
    27: [20, 28, 36, 37],
    28: [19, 20, 27, 29, 36],
    29: [19, 28, 30, 36],
    30: [29, 31, 32, 36],
    31: [30, 32, 33],
    32: [30, 31, 33, 34],
    33: [31, 32, 35, 0],
    34: [32, 35, 36],
    35: [33, 34],
    36: [27, 28, 29, 30, 34, 37],
    37: [27, 36, 38],
    38: [37, 39, 40],
    39: [38, 40, 41],
    40: [38, 39, 41],
    41: [39, 40]
};
var regions = {
    0: [0, 1, 2, 4, 5, 6, 7, 8, 9], //northern america
    1: [10, 11, 12, 13],//southern america
    2: [3, 14, 15, 16, 17, 18, 19],//europe
    3: [21, 22, 23, 24, 25, 26], //africa
    4: [20, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37], //asia
    5: [38, 39, 40, 41] //australia
}

var troopsAmounts = new Array(42);
troopsAmounts.fill(1);
var gamePawnsDiv = document.getElementsByClassName("pawns");
var gamePawns = new Array(41);
var selectedPawn = -1;
var oldSelectedPawn = -1;
var selectedPawnSoldiers = -1;
var isAttackSelected = false;
var isAttackerPawnSelected = false;
var fortifySelectedAmount = 0;
var player = 1; // which player is client
var playerTurn = 1; // whose turn to move.
var gameMode = 1; //1 deploy, 2 attack and 3 fortify 4 end turn
var deployAmount = 5; // minimum amount deployment. 
var deployments = {};
var shuffle = generateUniqueNumbers(0, 41);
gamePawns = fillPawns(gamePawns, shuffle);
colorPawns(gamePawns, gamePawnsDiv);
assignSoldiers(gamePawns, gamePawnsDiv, 100);

regionCheck(gamePawns, regions, player);
deploymentSection();
feedPawnsForModuleMenu(gamePawnsDiv, gamePawns);
whoseTurn();
