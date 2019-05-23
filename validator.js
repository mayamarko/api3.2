var DButilsAzure = require('./DButils');

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

exports.isEmail=function(email){ 
    return /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email) 
}

exports.onlyInt=function(num){
    return /^[0-9]+$/.test(num)
}

exports.isValidPassword=function(username){
    return /^[a-zA-Z0-9]{5,10}$/.test(username)
}

exports.validateInsertion = function (username, fname, lname, city, country, email, password) {
    return  onlyString(fname) && onlyString(lname) && onlyString(city) && onlyString(country) && isEmail(email) && isValidPassword(password)
}