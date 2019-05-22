var DButilsAzure = require('./DButils');
// var parse = require("body-parser");
// var express = require('express');
// var app = express();
// app.use(parse.json())
// app.use(parse.urlencoded({ extended: true }));

exports.isEmptyUsername= function(username){ //how to make it synchronic?
    DButilsAzure.execQuery("SELECT username FROM Users where username  = '" + username + "'")
            .then(function (result) {
                if (result.length > 0) {
                    console.log(true)
                    return false;
                }
                else {
                    console.log(notExist)
                    return /^[a-zA-Z]+{3,8}$/.test(username);
                }
            })
            .catch(function (err) {
                console.log(err)
                res.send(err)
            })

}

exports.onlyString=function(word){
    return /^[a-zA-Z]+$/.test(word)
}

exports.isEmail=function(email){ //not working
    return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.text(email) 
}

exports.onlyInt=function(num){
    return /^[0-9]+$/.test(num)
}

exports.isValidPassword=function(username){
    return /^[a-zA-Z0-9]{5,10}$/.test(username)
}