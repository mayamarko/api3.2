var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');
var parse = require("body-parser");
var jwt =require("jsonwebtoken");

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
app.use(parse.json())
app.use(parse.urlencoded({ extended: true }));
secret="thisIsHell"

app.post('/Register', function (req, res) {
    var username = req.body.username;
    var fname = req.body.first_name;
    var lname = req.body.last_name;
    var city = req.body.city;
    var country = req.body.country;
    var email = req.body.email;
    var question1 = req.body.question1;
    var answer1 = req.body.answer1;
    var question2 = req.body.question2;
    var answer2 = req.body.answer2;
    var password = req.body.password;
    var interestString=req.body.interests;
    DButilsAzure.execQuery("INSERT INTO Users (username,first_name,last_name,city,country,email,question1,answer1,question2,answer2) VALUES ('" + username + "','" + fname + "','" + lname + "','" + city + "','" + country + "','" + email + "','" + question1 + "','" + answer1 + "','" + question2 + "','" + answer2 + "')")
    .then(function (result) {
        DButilsAzure.execQuery("INSERT INTO Passwd (username,passwd) VALUES ('" + username + "','" + password + "')")
        .then(function (result) {
            var arr=interestString.split(',');
            var i;
            for(i=0;i<arr.length;i++){
                DButilsAzure.execQuery("INSERT INTO Interests (username,interest) VALUES ('" + username + "','" + arr[i] + "')") 
                .then(function (result) {
                    res.send(true)
                })
                .catch(function (err) {
                    console.log(err)            
                })
            }
        })
        .catch(function (err) {
            console.log(err)        
        })
    })
    .catch(function (err) {
        console.log(err)
        res.send(false)
    })     
})


app.post('/AddPoi', function (req, res) {
    var poiname = req.body.poiname;
    //var rank = parseInt(req.body.rank);
    var city = req.body.city;
    var category = req.body.category;
    var descr = req.body.descr;
    //ar views = parseInt(req.body.views);
    var pic=req.body.picture;
    DButilsAzure.execQuery("INSERT INTO Poi (poiname,rnk,city,category,descr,viw,numRank,picture) VALUES ('" + poiname + "','" + 0 + "','" + city + "','" + category + "','" + descr + "','" + 0 + "','"+ 0 +"','"+pic+"')")
        .then(function (result) {
            res.send(true)
        })
        .catch(function (err) {
            console.log(err)
            res.send(false)
        })
})

app.post('/addUserPoi', function (req, res) {
    var username = req.body.username;
    var poiId = parseInt(req.body.poid);
    var cnt = parseInt(req.body.cnt);
    DButilsAzure.execQuery("INSERT INTO userPoi (username,poiId,addate,cnt) VALUES ('" + username + "','" + poiId + "',getdate(),'" + cnt + "')")
        .then(function (result) {
            res.send(true)
        })
        .catch(function (err) {
            console.log(err)
            res.send(false)
        })
})


app.post('/saveReviewPoi', function (req, res) {
    var poiId = parseInt(req.body.poiId);
    var reviews = req.body.review;
    DButilsAzure.execQuery("INSERT INTO reviewPoi (poiId,review,wrdate) VALUES ('" + poiId + "','" + reviews + "',getdate())")
        .then(function (result) {
            res.send(true)
        })
        .catch(function (err) {
            console.log(err)
            res.send(false)
        })
})

app.post('/saveRankPoi', function(req, res){
    var poiId=parseInt(req.body.poiId);
    var rank=parseInt(req.body.rank);
    DButilsAzure.execQuery("SELECT rnk,numRank FROM Poi WHERE poiId='"+poiId+"'")
    .then(function(result){         
        var calcRank=(result[0].rnk*result[0].numRank+rank)/(result[0].numRank+1);
        var addedRank=result[0].numRank+1;
        DButilsAzure.execQuery("UPDATE Poi SET rnk = '"+calcRank+"',numRank = '"+addedRank+"' WHERE poiId='"+poiId+"';")
        .then(function(result1){
            res.send(true)
        })
        .catch(function(err){
            console.log(err)
            res.send(false)
        })
        //res.send(true)
    })
    .catch(function(err){
        console.log(err)
        res.send(false)
    })
})

app.delete('/deleteUserPoi', function(req, res){
    var poiId=parseInt(req.body.id);
    DButilsAzure.execQuery("DELETE FROM reviewPoi WHERE id='"+poiId+"'")
    .then(function(result){
        res.send(true)
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
app.use("/private", (req, res,next) =>{
	const token = req.header("x-auth-token");
	// no token
	if (!token){
        res.status(401).send("Access denied. No token provided.");
    } 
	// verify token
	try {
		const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        var username=req.decoded.name;
        req.username=username;
        DButilsAzure.execQuery("SELECT username FROM Users where username  = '" + username + "'")
        .then(function (result) {
            if (result.length > 0) {
                console.log(true)
                // res.send(result)
                next(); //move on to the actual function
            }
            else {
                console.log(notExist)
                // res.send(notExist)
            }
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
		
	} catch (exception) {
		res.status(400).send("Invalid token.");
	}
});
app.post('/private/restore', function (req, res) {
    var notExist = false;
    var username = req.username;
    var quastion = req.body.question;
    var answer = req.body.answer;
    DButilsAzure.execQuery("SELECT username FROM Users where username  = '" + username + "' and question= '" + quastion + "' and answer= '" + answer + "'")
        .then(function (result) {
            if (result.length == 1) {
                DButilsAzure.execQuery("SELECT password FROM Passwd where username  = '" + username + "'")
                    .then(function (result) {
                        if (result.length == 1) {
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


app.get('/retriveConfirmationQuestion', function (req, res) {
    var notExist = false;
    var username = req.query.username;
    DButilsAzure.execQuery("SELECT question FROM Users where username  = '" + username + "'")
        .then(function (result) {
            if (result.length == 1) {
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

app.get('/getRandomPoi', function (req, res) { //checkkkks
    var notExist = false;
    var username = req.query.username;
    var minRank = req.query.rank;
    var quer = "SELECT Poi.poiId, poiname, rnk, city, category, descr, viw, picture FROM Poi";
    if (minRank != null) {
        quer = "SELECT Poi.poiId, poiname, rnk, city, category, descr, viw, picture FROM Poi where rnk  >= '" + minRank + "'";
    }
    DButilsAzure.execQuery(quer)
        .then(function (result) {
            var len = result.length;
            var rand = Math.floor(Math.random() * (len));
            var rand1 = Math.floor(Math.random() * (len));
            var rand2 = Math.floor(Math.random() * (len));
            if (result.length > 0) {
                var ret;
                if (len > 2) {
                    while (rand1 === rand || rand === rand2 || rand1 === rand2) {
                        rand = Math.floor(Math.random() * (len));
                        rand1 = Math.floor(Math.random() * (len));
                        rand2 = Math.floor(Math.random() * (len));
                    }
                    ret = [result[rand], result[rand1], result[rand2]];
                }
                else if (len == 2) {
                    while (rand1 === rand) {
                        rand = Math.floor(Math.random() * (len));
                        rand1 = Math.floor(Math.random() * (len));
                    }
                    ret = [result[rand], result[rand1]];
                } else {
                    ret = [result[0]];
                }
                console.log(ret)
                res.send(ret)
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

app.get('/getSavedPOI', function (req, res) { //return last 2 saved by user else returns false
    var notExist = false;
    var username = req.query.username;
    DButilsAzure.execQuery("SELECT TOP 2 Poi.poiId, poiname, rnk, city, category, descr, viw, picture, cnt, addate FROM userPoi RIGHT JOIN Poi on userPoi.poiId=Poi.poiId where username  = '" + username + "' order by addate DESC")
        .then(function (result) {
            if (result.length > 0) {
                console.log(result)
                res.send(result)
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

app.get('/getAllPOIBu', function (req, res) { //return all poi by user (orderd by his choice)
    var notExist = false;
    var username = req.query.username;
    DButilsAzure.execQuery("SELECT Poi.poiId, poiname, rnk, city, category, descr, viw, picture, cnt FROM userPoi RIGHT JOIN Poi on userPoi.poiId=Poi.poiId where username  = '" + username + "'order by cnt DESC")
        .then(function (result) {
            if (result.length > 0) {
                console.log(result)
                res.send(result)
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

app.get('/getAllPOI', function (req, res) { //return all poi in the db
    var notExist = false;
    DButilsAzure.execQuery("SELECT Poi.poiId, poiname, rnk, city, category, descr, viw, picture FROM Poi")
        .then(function (result) {
            if (result.length > 0) {
                console.log(result)
                res.send(result)
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

app.get('/getAllPOIBN', function (req, res) { //return poi by name
    var notExist = false;
    var name = req.query.name;
    DButilsAzure.execQuery("SELECT Poi.poiId, poiname, rnk, city, category, descr, viw, picture FROM Poi WHERE poiname  = '" + name + "'")
        .then(function (result) {
            if (result.length > 0) {
                console.log(result)
                res.send(result)
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

app.get('/getInterests', function (req, res) {
    var notExist = false;
    var username = req.query.username;
    DButilsAzure.execQuery("SELECT interest FROM Interests where username  = '" + username + "'")
        .then(function (result) {
            if (result.length > 0) {
                console.log(result)
                res.send(result)
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

app.get('/getReviewPOI', function (req, res) { //return 2 most recent reviews of specific poi
    var notExist = false;
    var poiId = req.query.poiId;
    DButilsAzure.execQuery("SELECT TOP 2 review FROM reviewPoi where poiId  = '" + poiId + "' order by wrdate DESC")
        .then(function (result) {
            if (result.length > 0) {
                console.log(result)
                res.send(result)
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



app.post("/login", (req, res) => {
    var username=req.body.username;
    var password=req.body.password;
    payload = { name: username, password: password };
	options = { expiresIn: "1d" };
	const token = jwt.sign(payload, secret, options);
	res.send(token);
});



