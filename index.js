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
  
  /* URL validation */
  let urlRegex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
  if(inputUrl['url'].match(urlRegex)){
    res.json({error: "Invalid URL"});
    return
  }

  
  let inputShort=1;
  
  /* finding latest short number in database and incrementing it by one to not override previous URLs*/
  Url.findOne({}).sort({short: "desc"}).exec((err, result)=>{
    if(!err&&!=undefined){
      inputShort=result.short+1;
    }
    if(!error){
      Url.findOneAndUpdate(
        {original: inputUrl['url']},
        {original: inputUrl['url'], short: inputShort},
        {new: true, upsert: true}, //upsert creates new entry if it doesn't exist
        (error, savedUrl)=>{
          if(!error){
            responseObject['short_url']=savedUrl.short;
            res.json(responseObject);
          }
        }
      );
    }
  });
});

app.get("/api/shorturl/:input", (req,res)=>{
  let input=req.params.input;
  
  Url.findOne({short: input}, (error, result)=>{
    if(!error&&result!=undefined){
      res.redirect(result.original);
    }
    else
    {
      res.json("URL not found");
    }
  });
 
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
