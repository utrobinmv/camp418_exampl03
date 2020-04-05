const uuid = require('uuid');

let fieldNewUser = {
    id: 0,
    login: '',
    password: '',
    currentGame: 0,
};

const users = [
    {
        id: 1,
        login: 'max',
        password: 'qwerty',
        currentGame: 0,
    },
    {
        id: 2,
        login: 'ivan',
        password: 'ytrewq',
        currentGame: 0,
    },
];

const session = {};

function authMidleware(req, res, next) {
    // console.log('auth midleware runing')
    const userData = checkSession(req.headers.authorization);
    req.userCredentials = userData;

    next();
}

function fakeMiddleware(req, res, next) {
    // console.log('fake 1');
    next();
}

function fakeMiddleware2(req, res, next) {
    // console.log('fake 1');
    next();

}


function restricted(req, res, next) {
    if(!req.userCredentials) {
        res.send(401); 
    }    
    else {
        next();
    }
}
 
function checkLogin(login, password) {
    const user = users.find((el) => el.login === login && el.password === password);

    if (user) {
        let sessionID = uuid.v4();

        if(login === 'max') {  //Временно добавил для упрощения отладки
            sessionID = '5db93881-e944-41c7-9835-50e87a536c56';
        }
        if(login === 'ivan') {  //Временно добавил для упрощения отладки
            sessionID = '4af37b56-a5c8-41aa-b475-b3b0c018a2d9';
        }
        
        session[sessionID] = {
            id: user.id,
        }

        return sessionID;
    }

    return -1;
}

function getUserID(login) {
  const user = users.find((el) => el.login === login);
  return user.id; 
}

function registration(login, password) {
 
    let UserID;
    const user = users.find((el) => el.login === login);

    if (user != undefined) { //Такой пользователь уже существует!
        return undefined;
    }

    users.push(fieldNewUser);

    UserID = users.length;

    users[UserID-1].id = UserID;
    users[UserID-1].login = login;
    users[UserID-1].password = password;
 
    return UserID; 

}

function checkSession(sessionID) {
    return session[sessionID];
}

function joinToGame(userID, gameID) {
    const user = returnUser(userID, gameID);

    user.currentGame = gameID;
}

function returnCurrentGame(userID) {
    const user = returnUser(userID);

    return user.currentGame;
}

function returnUser(userID) {
    const user = users.find((el) => el.id === userID);
    return user;
}



module.exports = {
    registration,
    checkLogin,
    checkSession,
    authMidleware,
    fakeMiddleware,
    fakeMiddleware2,
    restricted,
    joinToGame,
    returnCurrentGame,
    getUserID,
}