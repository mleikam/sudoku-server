'use strict'
require('dotenv').config();

const express = require("express");
const app = express();
const logger = require('./middleware/logger')
const sudoku = require('./middleware/sudoku');
const cors = require('cors')

const port = process.env.PORT;

app.use('/',logger,cors());
app.get('/', sudoku, ({data}, res) => {
  console.log(data)
  res.json(data);
});

app.listen( port , function() {
  console.log('server started on ',port)
})
