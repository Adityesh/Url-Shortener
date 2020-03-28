var mongoose = require('mongoose');
var shortlink = require('shortlink');

var shortener = new mongoose.Schema({
    url : {
        type : String,
        required : true
    },
    shortUrl : {
        type : String,
        required : true
    }
})

var Url = mongoose.model('Url',shortener);
module.exports = Url;