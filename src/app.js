'use strict';
const express = require('express');
const router = require('./routes/routes');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/ingestion', router);


module.exports = {
    app
};