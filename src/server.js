const express = require('express');
const cors = require('cors');
const users = require('./users');

const app = express();

const routes = require('./routes');

app.use(express.json());
app.use(cors());
app.use(users.authMidleware);
//app.use(users.fakeMiddleware);
app.use(routes);

module.exports = app;
