var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');
var parse=require("body-parser");

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
app.use(parse.urlencoded({extended:true}));


app.post('/Register', function(req, res){
    var username=req.body.username;
    var fname=req.body.first_name;
    var lname=req.body.last_name;
    var city=req.body.city;
    var country=req.body.country;
    var email=req.body.email;
    var question=req.body.question;
    var answer=req.body.answer;
    var password=req.body.password;
    DButilsAzure.execQuery("INSERT INTO Users (username,first_name,last_name,city,country,email, question,answer) VALUES (\'"+username+"\',\'"+fname+"\',\'"+lname+"\',\'"+city+"\',\'"+country+"\',\'"+email+"\',\'"+question+"\',\'"+answer+"\')")
    DButilsAzure.execQuery("INSERT INTO Passwd (username,password) VALUES (\'"+username+"\',\'"+password+"\')")
    .then(function(result){     
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get('/addIntrests', function(req, res){
    var username=req.body.username;
    var poiId=req.body.username;
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
            if (result != null) {
                DButilsAzure.execQuery("SELECT password FROM Passwd where username  = '" + username + "'")
                    .then(function (result) {
                        if (result != null) {
                            console.log(result.query.password)
                            res.send(result.query.password)
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


app.post('/retriveConfirmationQuestion', function (req, res) {
    var notExist = false;
    DButilsAzure.execQuery("SELECT question FROM Users where username  = '" + req.body.username + "'")
        .then(function (result) {
            if (result != null) {
                console.log(result.body.question)
                res.send(result.body.question)
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
