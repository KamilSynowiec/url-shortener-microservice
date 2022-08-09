require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

let bodyParser=require('body-parser');

mongoose.connect(process.env.PW, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const Schema=mongoose.Schema;

let urlSchema=new Schema{
  original: {type: String, required: true},
  short: Number
};

app.post("/api/shorturl/new", bodyParser.urlencoded({extended: false}));

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
