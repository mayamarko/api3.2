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
    DButilsAzure.execQuery("INSERT INTO Passwd (username,passwd) VALUES (\'"+username+"\',\'"+password+"\')")
    .then(function(result){     
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/AddPoi', function(req, res){
    var poiname=req.body.poiname;
    var rank=parseInt(req.body.rank);
    var city=req.body.city;
    var category=req.body.category;
    var descr=req.body.descr;
    var views=parseInt(req.body.views);
    DButilsAzure.execQuery("INSERT INTO Poi (poiname,rnk,city,category,descr,viw) VALUES (\'"+poiname+"\',\'"+rank+"\',\'"+city+"\',\'"+category+"\',\'"+descr+"\',\'"+views+"\')")
    .then(function(result){     
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/addUserPoi', function(req, res){
    var username=req.body.username;
    var poiId=parseInt(req.body.poid);
    var cnt=parseInt(req.body.cnt);
     DButilsAzure.execQuery("INSERT INTO userPoi (username,poiId,addate,cnt) VALUES ('"+username+"','"+poiId+"',getdate(),'"+cnt+"')")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

//not done yet!! never checked 21/5/19 11:01
app.post('/saveReviewPoi', function(req, res){
    var username=req.body.username;
    var poiId=parseInt(req.body.poid);
    DButilsAzure.execQuery("INSERT INTO reviewPoi (poiId,review,date) VALUES ('"+username+"','"+poiId+"',getdate())")
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
