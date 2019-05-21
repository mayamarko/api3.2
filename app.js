var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});


app.get('/Register', function(req, res){
    DButilsAzure.execQuery("INSERT INTO Users (username,first_name,last_name,city,country,email, quastion,answer) VALUES ('abc','a','b','is','israel','abc@123.co','is it','yes')")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get('/add1', function(req, res){
    DButilsAzure.execQuery("INSERT INTO PoiUsers (username,poiId) VALUES (req.)")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get('/select', function(req, res){
    DButilsAzure.execQuery("SELECT * FROM tableName")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})


