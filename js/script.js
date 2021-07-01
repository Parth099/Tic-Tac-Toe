function attachEvents(){

    let selectorList = document.querySelectorAll(".ttt-board-tile")
    selectorList.forEach((tile) => {

        //hover highlighting
        tile.addEventListener("mouseover", (e) => {
            if(tile.classList.contains("unsigned")){
                e.target.textContent = board.getTurn().symbol;
            }
        })

        tile.addEventListener("mouseleave", (e) => {
            if(tile.classList.contains("unsigned")){
                e.target.textContent = "";
            }
        })

        //pushing sym
        tile.addEventListener("click", (e) => {
            if(tile.classList.contains("unsigned")){
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
//first use of ES module
const board = function(){
    
    let turn = 0
    const playerFactory = function(symbol, name){
        return {symbol, name};
    }

    const p1 = playerFactory("X", "Parth");
    const p2 = playerFactory("O", "Not Parth");
    var currTurn = p2;

    let boardArr = ["", "", "", "", "", "", "", "", ""];

    let getTurn = () => (turn) ? p2 : p1;

    let reflectArray = function(dataIndex, sym){
        boardArr[dataIndex] = sym;
        turn ^= 1;
        checkWin()
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
    let checkWin = function(){//--> bool
        let diag = checkDiag(boardArr);
        let vert = checkVert(boardArr);
        let hori = checkHori(boardArr);
        let win  = diag || hori || vert;
        if(win){
            //display winner node
            document.querySelector(".winner-cont").classList.add("show-winner")
            document.querySelector(".winner-text").textContent = `${getWinner(win)} has Won!`

            //clone and repush to delete input events
            detachEvents();
            }
        else if(boardArr.findIndex(i => i == "") < 0){
            detachEvents()
            document.querySelector(".winner-cont").classList.add("show-winner")
            document.querySelector(".winner-text").textContent = `There was a Tie :(`
        }
        //set up is not in the form (a && b && c) to prevent short circuit eval
    }

    let checkDiag = function(arr) {
        //checks if cells are even tripped first, short circuit eval
        if( (arr[0] && arr[4] && arr[8]) && arr[0] == arr[4] && arr[4] == arr[8]){
            focus(0, 4, 8);
            return arr[0];
        }     
        if( (arr[2] && arr[4] && arr[6]) && arr[2] == arr[4] && arr[4] == arr[6]){
            focus(2, 4, 6);
            return arr[2];
        }  
        return false;
    }

    let checkVert = function(arr){
        let condit;
        for(let i = 0; i < 3; i++){
            condit = arr[0 + (i * 3)] && arr[1 + (i * 3)] && arr[2 + (i * 3)];
            if(condit && arr[0 + (i * 3)] == arr[1 + (i * 3)] && arr[1 + (i * 3)] == arr[2 + (i * 3)]){
                focus(0 + (i * 3), 1 + (i * 3), 2 + (i * 3))
                return arr[0 + (i * 3)];
            }
        }
        return false;
    }

    let checkHori = function(arr){
        let condit;
        for(let i = 0; i < 3; i++){
            condit = arr[0 + i] && arr[3 + i] && arr[6 + i];
            if(condit && arr[0 + i] == arr[3 + i] && arr[3 + i] == arr[6 + i]){
                focus(0 + i, 3 + i, 6 + i)
                return arr[0 + i];
            }
        }
        return false;
    }

    let focus = function(w1, w2, w3) {
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
    }

    document.querySelector(".reset-btn").addEventListener("click", reset)



    return {getTurn, reflectArray};
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
attachEvents()

