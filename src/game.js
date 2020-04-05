
let fieldNewGame = {
    id: 0,
    user_id1: 0,
    user_id2: 0,
    currentPlayer: 1,
    winnerId: 0,
    status: 'new', 
    field: [[0,0,0], [0,0,0], [0,0,0]],
};

let listGames = [
    {
        id: 1,
        user_id1: 1,
        user_id2: 2,
        currentPlayer: 1,
        winnerId: 0,
        status: 'play', 
        field: [[0,0,0], [0,0,0], [0,0,0]],
    },
    {
        id: 2,
        user_id1: 1,
        user_id2: 0,
        currentPlayer: 1,
        winnerId: 0,
        status: 'new', 
        field: [[0,0,0], [0,0,0], [0,0,0]],
    },
];

function getField(gameID) {

    let game  = returnGame(gameID);

    return game.field;
}

function makeMove(userID, gameID, x, y) {
    const game = returnGame(gameID);

    game.field[y-1][x-1] = game.currentPlayer;

    updateWinners(game,game.field);

    if(game.currentPlayer == 1) {
        game.currentPlayer = 2;
    }
    else {
        game.currentPlayer = 1;
    }

}


function checkMove(userID, gameID, x, y) {

    const game = returnGame(gameID);

    if(game.currentPlayer == undefined) {
        setCurrentPlayer(gameID, 1);
    }    

    if(game.field[0][0] == undefined) {
        reset(game);
    }

    if(game.field[y-1][x-1] == 0) {
        return "ok";     
    } else {
        return "not ok";     
    }
}

function reset(gameID) {
    let game  = returnGame(gameID);

    game.field = [[0,0,0], [0,0,0], [0,0,0]];
    game.currentPlayer = 1;
}

function updateWinners(game, field){
    //gorizontal
    for(let row=0; row<3; row++ ) {
        if( game.field[row][0] == game.field[row][1] && game.field[row][0] == game.field[row][2] ){
            game.winnerId = game.field[row][0];
        }
    }

    //vertical
    for(let column=0; column<3; column++ ) {
        if( game.field[0][column] == game.field[1][column] && game.field[0][column] == game.field[2][column] ){
            game.winnerId = game.field[0][column];
        }
    }

    if( game.field[0][0] == game.field[1][1] && game.field[0][0] == game.field[2][2] ){
        game.winnerId = game.field[0][0];
    }

    if( game.field[2][0] == game.field[1][1] && game.field[2][0] == game.field[0][2] ){
        game.winnerId = game.field[2][0];
    }
}

function presetField(gameID, newField) {
    const game = returnGame(gameID);
    game.field = newField;
}

function getWinner(gameID){
    const game = returnGame(gameID);
    return game.winnerId;
}

function setCurrentPlayer(gameID, i) {
    const game = returnGame(gameID);
    game.currentPlayer = i;
}

function getCurrentPlayer(gameID) {
    const game = returnGame(gameID);
    return game.currentPlayer;
}

function newGame(userID) {
    let GameID;
    listGames.push(fieldNewGame);

    GameID = listGames.length;

    listGames[GameID-1].id = GameID;
    listGames[GameID-1].user_id1 = userID;

    return listGames[GameID-1];
}

function getListGames(userID) {
    
    let outGames = [];

    for(i = 0; i < listGames.length; i++) {
 
        outGames.push(listGames[i]);
    }

    return outGames;

}


function returnGame(gameID) {
    const game = listGames.find((el) => el.id == gameID);
    return game;
}

function joinToGame(userID, gameID) {

    //Проверка на возможность включится в игру
    let check = checkPlayToGame(userID, gameID);

    if(check != undefined) {
        return check;
    }

    let game = returnGame(gameID);

    //Проверка на подключение второго игрока, если пока игра с одним
    if(game.user_id2 === 0) {
        game.user_id2 = userID;
        
        game.status = 'play';
        
        return game;
    }
   
    return undefined;
    
}

function checkPlayToGame(userID, gameID) {

    let game = returnGame(gameID);

    //Проверка на возможность включится в игру
    if(game.user_id1 === userID) {
        return game;
    }

    if(game.user_id2 === userID) {
        return game;
    }

    return undefined;

}

function ckeckStatusGame(userID, gameID) {

    let game = returnGame(gameID);

    let check = checkPlayToGame(userID, gameID);

    if(check != undefined) {
        if(game != undefined) {
            return game.status;
        }
    
    }

    return undefined;

}

module.exports = {
    getField,
    makeMove,
    reset,
    presetField,
    setCurrentPlayer,
    getCurrentPlayer,
    checkMove,
    getWinner,
    newGame,
    getListGames,
    joinToGame,
    ckeckStatusGame,
}
