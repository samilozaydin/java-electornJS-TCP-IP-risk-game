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
function fillPawns(pawns, shuffled) {
    for (var i = 0; i < pawns.length; i++) {
        (i % 2 == 0) ? pawns[shuffled[i]] = 1 : pawns[shuffled[i]] = 2;
    }
    return pawns;
}
function colorPawns(pawns, pawnDocs) {
    for (var i = 0; i < pawns.length; i++) {
        (pawns[i] == 1) ? pawnDocs[i].className = "pawns red-pawns" :
            pawnDocs[i].className = "pawns blue-pawns";
    }
}
function assignSoldiers(pawns, pawnsDoc, totalSoldier) {
    troopsAmounts.fill(1);
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
    if (isAllSame) {
        var winner = gamePawns[0];
        document.getElementsByClassName("riskgame").innerText = "THE WINNER IS P" + winner;
    }
}
function feedPawnsForModuleMenu(pawnDocs, pawns) {
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
function deploymentSection() {
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
        console.log(deployments)
        troopAmountDiv[0].innerText = troopAmount;
        selectedPawnDiv.innerText = selectedPawnAmount;

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

    }
    document.getElementsByClassName("section-indicator")[0].innerText = "Deploy"
}
function attackSection() {
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

    console.log(selectedPawn);
    console.log(oldSelectedPawn);

    var blueTroopId = gamePawns[selectedPawn] == 2 ? selectedPawn : oldSelectedPawn;
    var blueTroop = new Number(document.getElementById("pawn_" + blueTroopId).innerText)
    var redTroopId = gamePawns[selectedPawn] == 1 ? selectedPawn : oldSelectedPawn;
    var redTroop = new Number(document.getElementById("pawn_" + redTroopId).innerText)
    var blueTroopDiv = document.getElementById("pawn_" + blueTroopId);
    var redTroopDiv = document.getElementById("pawn_" + redTroopId);
    console.log(redTroopDiv);

    console.log(blueTroopId);
    console.log(blueTroop);
    console.log(redTroopId);
    console.log(redTroop);
    console.log(blueTroopDiv);
    console.log(redTroopDiv);
    console.log(redTroop);

    if (result > 0) {

        console.log(blueTroop)
        blueTroop -= result;
        blueTroopDiv.innerText = blueTroop;
        if (blueTroop <= 0 && player == 1) {

            blueTroopDiv.innerText = Math.floor(redTroop / 2);
            redTroop = Math.ceil(redTroop / 2);
            redTroopDiv.innerText = redTroop;
            gamePawns[blueTroopId] = 1;
            colorPawns(gamePawns, gamePawnsDiv);
        } else if (blueTroop <= 0 && player == 2) {
            console.log("blabla");
            blueTroopDiv.innerText = 1;
        }
    } else if (result < 0) {
        console.log(redTroop);

        redTroop += result;
        redTroopDiv.innerText = redTroop;
        if (redTroop <= 0 && player == 2) {

            redTroopDiv.innerText = Math.floor(blueTroop / 2);
            blueTroop = Math.ceil(blueTroop / 2);
            blueTroopDiv.innerText = blueTroop;
            gamePawns[redTroopId] = 2;
            colorPawns(gamePawns, gamePawnsDiv);
        } else if (redTroop <= 0 && player == 1) {
            console.log("blabla");

            redTroopDiv.innerText = 1;
        }
    }

    winCheck();
    clear(gamePawnsDiv);
    feedPawnsForModuleAttack(gamePawnsDiv, gamePawns);
}
function clear(pawnDocs) {
    for (var i = 0; i < pawnDocs.length; i++) {
        pawnDocs[i].onclick = (e) => { };
        pawnDocs[i].style.boxShadow = "0px 0px 5px 1px black";
    }
}
function feedPawnsForModuleAttack(pawnDocs, pawns) {
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
function feedPawnsForFortify(pawnDocs, pawns) {

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
function fortifySection() {
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

    }
    document.getElementsByClassName("section-indicator")[0].innerText = "Fortify";
}
function endTurn() {

}
function gameFlow(e) {
    gameMode++;
    if (gameMode == 1) {
        regionCheck(gamePawns, regions, player);
        deploymentSection();
        feedPawnsForModuleMenu(gamePawnsDiv, gamePawns);
        whoseTurn();

    } else if (gameMode == 2) {
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
        clear(gamePawnsDiv);
        fortifySection();
        feedPawnsForFortify(gamePawnsDiv, gamePawns);
    } else if (gameMode == 4) {
        deployAmount = 5;
    }
}

document.getElementsByClassName("next-section")[0].onclick = (e) => gameFlow(e);




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
    26: [20, 21, 23, 24, 25],
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
var gamePawnsDiv = document.getElementsByClassName("pawns");
var gamePawns = new Array(41);
var troopsAmounts = new Array(42);
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
