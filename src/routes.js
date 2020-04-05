const router = require('express').Router();
const logger = require('./lib/logger');
const controller = require('./game');
const users = require('./users');

router.get('/getField', users.restricted, (req, res) => {
    // console.log('userCredenrial ', req.userCredentials);

    const gameID = users.returnCurrentGame(req.userCredentials.id);

    if(!req.userCredentials) {
      res.send(401);
    }

    res.send(200, controller.getField(gameID));
});
  
router.post('/move', users.restricted, (req, res) => { 
    // logger.log(req.body);

    if(!req.userCredentials) {
      res.send(401);
    }

    const gameID = users.returnCurrentGame(req.userCredentials.id);

    otvet = controller.checkMove(req.userCredentials.id, gameID, req.body.x, req.body.y);

    if(otvet == 'ok') {
      controller.makeMove(req.userCredentials.id, gameID, req.body.x, req.body.y);
    }
    res.send(200, otvet);
  });

  router.post('/login', (req, res) => {
    const userID = users.checkLogin(req.body.login, req.body.password);
    logger.log('/login ', req.body.login, req.body.password);

    res.send(200, userID);
  });

  router.post('/registration', (req, res) => {
    const userID = users.registration(req.body.login, req.body.password);

    if (userID != undefined) {
      res.send(200, userID);
      return;
    }

    res.send(400, 'not ok');
  });  

  router.post('/newGame', users.restricted, (req, res) => {
    const GameID = controller.newGame(req.userCredentials.id);
    res.send(200, GameID);
  });

  router.get('/getlistGames', users.restricted, (req, res) => {
    const listGames = controller.getListGames(req.userCredentials.id);
    res.send(200, listGames);
  });

  router.post('/joinToGame', users.restricted, (req, res) => {

    const gameID = req.body.gameID;

    const Game = controller.joinToGame(req.userCredentials.id,  gameID);

    if(Game != undefined) {
      const User = users.joinToGame(req.userCredentials.id, gameID);

      res.send(200, Game);
      return;
    }

    res.send(400, 'not ok');

  });

  router.get('/ckeckStatusGame', users.restricted, (req, res) => {

    const gameID = req.body.gameID;
    
    const status = controller.ckeckStatusGame(req.userCredentials.id, gameID);
    if(status != undefined) {
      res.send(200, status);
      return;
    }
    res.send(400, 'not ok');
  });

module.exports = router; 