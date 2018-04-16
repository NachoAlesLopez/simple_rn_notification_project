const express = require('express');
const methods = require('./methods');

var app = express();

app.get("/test", methods.getNotifications);

app.listen(3001);