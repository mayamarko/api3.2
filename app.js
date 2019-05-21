var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});


app.get('/reg', function (req, res) {
    DButilsAzure.execQuery("INSERT INTO PoiUsers (username,poiId) VALUES ('abc',1)")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
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
    DButilsAzure.execQuery("SELECT username FROM Users where username  = '" + req.body.username + "' and question= '" + req.body.quastion + "' and answer= '" + req.body.answer + "'")
        .then(function (result) {
            if (result != null) {
                DButilsAzure.execQuery("SELECT password FROM Passwd where username  = '" + req.body.username + "'")
                    .then(function (result) {
                        if (result != null) {
                            console.log(result.body.password)
                            res.send(result.body.password)
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