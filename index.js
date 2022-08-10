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

let Url=mongoose.model("Url", urlSchema);
let responseObject={};

app.post("/api/shorturl", bodyParser.urlencoded({extended: false}), (req,res)=>{
  
  let inputUrl=req.body;
  
  let inputShort=1;
  
  /* finding latest short number in database and incrementing it by one to not override previous URLs*/
  Url.findOne({}).sort({short: "desc"}).exec((err, result)=>{
    if(!err&&!=undefined){
      inputShort=result.short+1;
    }
  });
  
  res.json(responseObject);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
