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
                var index = Number(e.target.getAttribute("data-tile-num")) - 1;
                board.reflectArray(index ,playerSym);
            }
        })
        tile.classList.add("unsigned")
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

    let getTurn = function(){
        if(turn){
            return p2; 
        }
        return p1;
    }

    let reflectArray = function(dataIndex, sym){
        boardArr[dataIndex] = sym;
        turn ^= 1;
    }

    return {getTurn, reflectArray};
}();

attachEvents()

