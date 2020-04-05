const { Given } = require('cucumber');
const { Then } = require('cucumber');
const controller = require('../src/game')
const users = require('../src/users')
const request = require('supertest');
const logger = require('../src/lib/logger');
const assert = require('assert');
//const expect = require('expect');

const app = require('../src/server');

let lastResult = {};
let lastUser = {
  Authorization: '',
  userID: ''
};

let lastGameID;


Given('Пользователь {string} авторизуется по паролю {string}', (login, password) => {
  // Write code here that turns the phrase above into concrete actions
  return request(app)
      .post('/login')
      .send({login,password})
      .then((res) => {
        
        lastUser.Authorization = res.text;
        lastUser.userID = users.getUserID(login);

        // logger.log('Результат авторизации ', login, password, res.text);

      });
});

Given('Пользователь входит в игру {int}', (gameID) => {

  return request(app)
      .post('/joinToGame')
      .set('Authorization', lastUser.Authorization)
      .send({gameID})
      .then((res) => {
        
        let game = res.text;

        lastGameID = gameID;

        // logger.log('Результат входа в игру ', gameID, res.text);

      });

  });


Given('пустое поле', () => {
    controller.reset(lastGameID);
  });

Given('ходит игрок {int}', (i) => {
    // Given('ходит игрок {float}', function (float) {
      // Write code here that turns the phrase above into concrete actions

      controller.setCurrentPlayer(lastGameID, i);

      // logger.log("Ходит игрок номер: " + controller.getCurrentPlayer(lastGameID));
  });


 Given('игрок ходит в клетку {int}, {int}', (x, y) => {

  return request(app)
      .post('/move')
      .set('Authorization', lastUser.Authorization)
      .send({x,y})
      .then((res) => {
        lastResult = res;
        //res.status;
        //logger.log("Ходит в клетку {y}, {x}, {Результат}: ", y,x, res.text);

        //logger.log("Победитель " + controller.getWinner(lastGameID));
      });

   });


   Then('поле становится {string}', (string) => {

    return request(app)
    .get('/getField')
    .set('Authorization', lastUser.Authorization)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {

        let responseBody = response.body.toString();
        responseBody = responseBody.replace(/,/g,"");
        let string2 = string.replace("|","");
        string2 = string2.replace("|","");


        assert.equal(responseBody, string2);

        //logger.log("Вернул поле: " + responseBody + ' сравнивал с ' + string2);
      });

   });

   Given('поле {string}', (string) => {

    string = string.replace(/\|/g,"");
    let newField = [[],[],[]];
    for( let i in string ){
        newField[Math.floor(i/3)][i%3] = string[i];
    }

    controller.presetField(lastGameID, newField);

    // Write code here that turns the phrase above into concrete actions
  });
 
  Then('возвращается ошибка', () => {
    // logger.log("Проверка на ошибку: " + lastResult.text);
   
    assert.equal(lastResult.text, 'not ok');
    // Write code here that turns the phrase above into concrete actions
  });

  Then('победил игрок {int}', function (int) {
    assert.equal(int, controller.getWinner(lastGameID));
    });