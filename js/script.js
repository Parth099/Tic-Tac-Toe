//first use of ES module
const board = function(){
    
    let turn = 0
    const playerFactory = function(symbol, name, isAi){
        return {symbol, name, isAi};
    }

    let setPlayerName = function(name, key){
        if(key){
            p2.name = name;
        }
        else{
            p1.name = name;
        }
    }

    const p1 = playerFactory("X", "-Player 1-", false);
    const p2 = playerFactory("O", "-Player 2-", false);
    let runAiCheck = function(){

        ai1 = document.getElementById("isAi1").checked;
        ai2 = document.getElementById("isAi2").checked
        p1.isAi = ai1;
        p2.isAi = ai2;

        return {ai1, ai2}
    }
    var currTurn = p2;

    let boardArr = ["", "", "", "", "", "", "", "", ""];

    let getTurn = () => (turn) ? p2 : p1;

    let reflectArray = function(dataIndex, sym){
        boardArr[dataIndex] = sym;
        turn ^= 1;
        let isWin = checkWin(boardArr, mmFLAG = 0)

        if(getEmptySpaces(boardArr) != 0 && getTurn().isAi){
            setTimeout(playMove, 300)
            checkWin(boardArr)
        }
        
    }

    let detachEvents = function(){
        let tileCont = document.querySelector(".ttt-board")
        let tiles = document.querySelectorAll(".ttt-board-tile");
        let clone;
        for(let i = 0; i < tiles.length; i++){
            clone = tiles[i].cloneNode();
            clone.textContent = boardArr[i]
            tileCont.appendChild(clone)
            tiles[i].remove();
        }
    }
    let getWinner = function(tag){
        if(p1.symbol == tag){
            return p1.name;
        }
        return p2.name;
    }
    let checkWin = function(boardArr, mmFLAG = 0){//--> bool
        let diag = checkDiag(boardArr, mmFLAG = mmFLAG);
        let vert = checkVert(boardArr, mmFLAG = mmFLAG);
        let hori = checkHori(boardArr, mmFLAG = mmFLAG);
        let win  = diag || hori || vert;
        if(win && !mmFLAG){
            //display winner node
            document.querySelector(".winner-cont").classList.add("show-winner")
            document.querySelector(".winner-text").textContent = `${getWinner(win)} has Won!`

            //clone and repush to delete input events
            detachEvents();
            }
        else if(boardArr.findIndex(i => i == "") < 0 && !mmFLAG){
            detachEvents()
            document.querySelector(".winner-cont").classList.add("show-winner")
            document.querySelector(".winner-text").textContent = `There was a Tie :(`
        }
        return win;
        //set up is not in the form (a && b && c) to prevent short circuit eval
    }

    let checkDiag = function(arr, mmFLAG) {
        //checks if cells are even tripped first, short circuit eval
        if( (arr[0] && arr[4] && arr[8]) && arr[0] == arr[4] && arr[4] == arr[8]){
            focus(0, 4, 8, mmFLAG);
            return arr[0];
        }     
        if( (arr[2] && arr[4] && arr[6]) && arr[2] == arr[4] && arr[4] == arr[6]){
            focus(2, 4, 6);
            return arr[2];
        }  
        return false;
    }

    let checkVert = function(arr, mmFLAG){
        let condit;
        for(let i = 0; i < 3; i++){
            condit = arr[0 + (i * 3)] && arr[1 + (i * 3)] && arr[2 + (i * 3)];
            if(condit && arr[0 + (i * 3)] == arr[1 + (i * 3)] && arr[1 + (i * 3)] == arr[2 + (i * 3)]){
                focus(0 + (i * 3), 1 + (i * 3), 2 + (i * 3), mmFLAG)
                return arr[0 + (i * 3)];
            }
        }
        return false;
    }

    let checkHori = function(arr, mmFLAG){
        let condit;
        for(let i = 0; i < 3; i++){
            condit = arr[0 + i] && arr[3 + i] && arr[6 + i];
            if(condit && arr[0 + i] == arr[3 + i] && arr[3 + i] == arr[6 + i]){
                focus(0 + i, 3 + i, 6 + i, mmFLAG)
                return arr[0 + i];
            }
        }
        return false;
    }

    let focus = function(w1, w2, w3, mmFlag = 1) {
        if(mmFlag){
            return;
        }
        let tiles = document.querySelectorAll(".ttt-board-tile");
        for(let i = 0; i < tiles.length; i++){
            if(i == w1 || i == w2 || i == w3){
                continue;
            }
            tiles[i].classList.add("tile-unfocus")
        }
    }

    let reset = function(){
        turn = 0;
        boardArr = ["", "", "", "", "", "", "", "", ""];
        detachEvents();
        attachEvents();
        document.querySelector(".winner-cont").classList.remove("show-winner")

        if(board.getTurn().isAi){
            playMove();
        }
    }


    let getEmptySpaces = function(arr){
        let emptyArr = []
        for(let i = 0; i < arr.length; i++){
            if(arr[i] != "X" && arr[i] != "O"){
                emptyArr.push(i)
            }
        }
        return emptyArr
    }

    let getBoardCopy = function(){
        let copy = []
        for(let i = 0; i < boardArr.length; i++){
            if(boardArr[i]){
                copy.push(boardArr[i]);
            }
            else{
                copy.push(i);
            }
        }
        return copy
    }
    document.querySelector(".reset-btn").addEventListener("click", reset)

    return {getTurn, reflectArray, setPlayerName, checkWin, getEmptySpaces, getBoardCopy, runAiCheck};
}();

function swapTurns(){
    let infoSet = document.querySelectorAll(".sc-info")
    if(infoSet[0].classList.contains("hasTurn")){
        infoSet[0].classList.remove("hasTurn")
        infoSet[1].classList.add("hasTurn")
    }
    else{
        infoSet[0].classList.add("hasTurn")
        infoSet[1].classList.remove("hasTurn")
    }
}

function isBlank(str){
    return (!str || /^\s*$/.test(str));
}

function nameValidator(){
    let n1 = document.querySelector("#p1").value || "";
    let n2 = document.querySelector("#p2").value || "Computer";
    
    if(!isBlank(n1) && !isBlank(n2)){
        const playerAiStatus = board.runAiCheck();
        let p1AiS = (playerAiStatus.ai1) ? "[Ai]" : "";
        let p2AiS = (playerAiStatus.ai2) ? "[Ai]" : "";
        board.setPlayerName(n1, 0);
        board.setPlayerName(n2, 1)

        document.getElementById("p1-name").textContent = `${p1AiS} ${n1}`;
        document.getElementById("p2-name").textContent = `${p2AiS} ${n2}`;
        document.querySelector(".landing-page").style.display = "none"
        let main = document.querySelector("main");
        main.style.display = "block"
        main.classList.add("fade-in")

        //ai
        if(board.getTurn().isAi){
            playMove();
        }
    }
    return;
}

//freeCodeCamp article led me to make this part
function minimax2(sCopy, symbol){
    var availSpots = board.getEmptySpaces(sCopy);
    const winner = board.checkWin(sCopy, mmFLAG = 1)

    if(availSpots.length == 0){
        return {score :  0 };
    }
    else if(winner == "X"){
        return {score :  10};
    }
    else if(winner == "O"){
        return {score : -10};
    }

    var moves = [];
    for (var i = 0; i < availSpots.length; i++){
        //create an object for each and store the index of that spot 
        var move = {};
        move.index = sCopy[availSpots[i]];
    

        sCopy[availSpots[i]] = symbol;
        
        //fix below
        if (symbol == "X"){ //ai supposed move
            var result = minimax2(sCopy, "O");
            move.score = result.score;
        }
        else{
            var result = minimax2(sCopy, "X");
            move.score = result.score;
        }

        sCopy[availSpots[i]] = move.index;
        
        // push the object to the array
        moves.push(move);
    }

    var bestMove;
    if(symbol === "X"){
      var bestScore = -10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    else{
  
  // else loop over the moves and choose the move with the lowest score
      var bestScore = 10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
  
  // return the chosen move (object) from the moves array
    return moves[bestMove];
}

function playMove(){
    //for ai
    ai = board.getTurn().symbol
    data = minimax2(board.getBoardCopy(), ai);
    tile = document.querySelector(`[data-tile-num='${data.index + 1}']`)
    tile.textContent = ai;
    tile.classList.remove("unsigned")
    swapTurns()
    board.reflectArray(data.index, ai)
    

}
function attachEvents(){
    let selectorList = document.querySelectorAll(".ttt-board-tile")
    selectorList.forEach((tile) => {

        //hover highlighting
        tile.addEventListener("mouseover", (e) => {
            if(tile.classList.contains("unsigned") && !board.getTurn().isAi){
                e.target.textContent = board.getTurn().symbol;
            }
        })

        tile.addEventListener("mouseleave", (e) => {
            if(tile.classList.contains("unsigned") && !board.getTurn().isAi){
                e.target.textContent = "";
            }
        })

        //pushing sym
        tile.addEventListener("click", (e) => {
            if(tile.classList.contains("unsigned") && !board.getTurn().isAi){
                //setting the space to symbol
                var playerSym = board.getTurn().symbol;
                e.target.textContent = playerSym; 
                tile.classList.remove("unsigned")

                //changing boardArr
                swapTurns()
                var index = Number(e.target.getAttribute("data-tile-num")) - 1;
                board.reflectArray(index ,playerSym);
            }
        })
        tile.classList.add("unsigned")
        tile.classList.remove("tile-unfocus")
    })
}

attachEvents()