var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');
var parse=require("body-parser");

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
app.use(parse.urlencoded({extended:true}));


app.get('/Register', function(req, res){
    DButilsAzure.execQuery("INSERT INTO Users (username,first_name,last_name,city,country,email, quastion,answer) VALUES ('abcd','a','b','is','israel','abc@123.co','is it','yes')")
    DButilsAzure.execQuery("INSERT INTO Passwd (username,password) VALUES ('abcd','yes')")
    .then(function(result){     
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get('/addIntrests', function(req, res){
    DButilsAzure.execQuery("INSERT INTO PoiUsers (username,poiId) VALUES ('abc',1)")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get('/select', function (req, res) {
    DButilsAzure.execQuery("SELECT * FROM tableName")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})

app.post('/restore', function (req, res) {
    var notExist = false;
    var username=req.body.username;
    var quastion=req.body.question;
    var answer=req.body.answer;
    DButilsAzure.execQuery("SELECT username FROM Users where username  = '" + username + "' and question= '" + quastion + "' and answer= '" + answer + "'")
        .then(function (result) {
            if (result.length==1) {
                DButilsAzure.execQuery("SELECT password FROM Passwd where username  = '" + username + "'")
                    .then(function (result) {
                        if (result.length==1) {
                            console.log(result[0].password)
                            res.send(result[0].password)
                        }
                        else {
                            console.log(notExist)
                            res.send(notExist)
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                        res.send(err)
                    })
            }
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})


app.post('/retriveConfirmationQuestion', function (req, res) { //need to change to get!
    var notExist = false;
    var username=req.body.username;
    DButilsAzure.execQuery("SELECT question FROM Users where username  = '" + username + "'")
        .then(function (result) {
            if (result.length==1) {
                console.log(result[0].question)
                res.send(result[0].question)
            }
            else {
                console.log(notExist)
                res.send(notExist)
            }
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})
