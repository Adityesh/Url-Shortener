'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Url = require('./models/Url');
var bodyParser = require('body-parser');
var urlExists = require('url-exists');
const dotenv = require('dotenv').config();

var cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.json())

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);
mongoose.connect(process.env.DB_URI,{useNewUrlParser : true,useUnifiedTopology : true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("Connected")});

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post('/api/shorturl/new',(req,res)=> {
  let insert = new Url({
    url : req.body.url
  })

  urlExists(req.body.url,(err,exists) => {
    console.log(err,exists)
    if(exists) {
      Url.findOne({"url":req.body.url},(err,doc) => {
        if(doc != null) {
          res.status(200).json({
            original_url : req.body.url,
            short_url : doc.shortUrl
          })
        } else {
          let shortlink = require('shortlink').generate(3);
          let insert = new Url({
            "url" : req.body.url,
            "shortUrl" : shortlink
          })
          Url.create(insert);
          res.status(200).json({
            original_url : req.body.url,
            short_url : shortlink
          })
        }
      })
    } else {
      res.status(400).json({
        error:"invalid URL"
      })
    }
  })
  

  
  
});

app.get('/api/shorturl/:shortUrl',(req, res) => {
  let shortUrl = req.params.shortUrl;

  Url.findOne({"shortUrl":shortUrl},(err,doc) => {
    console.log(doc)
    if(doc != null) {
      res.status(200).redirect(doc.url);
    } else {
      res.status(400).send("400 BAD REQUEST.");
    }
  })
  
})




app.listen(port, function () {
  console.log(`Node.js listening ... ${port}`);
});


