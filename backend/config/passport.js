const passport = require('passport')
const localStrategy = require('passport-local')
const db = require('../db/connection.js')
const validPassword = require('./passwordUtil.js').validPassword

passport.use(new localStrategy(function verify(username,password,cb){
    db.any(`SELECT * FROM players WHERE username = '${username}';`)
        .then((results) => {
            if(results.length == 0){
                return cb(null, false)
            }
            const isValid = validPassword(password, results[0].hash, results[0].salt)
            if(isValid){return cb(null, results[0])}
            else{return cb(null, false)}
        }).catch((error)=>{cb(error)})
}))
passport.serializeUser(function(user, done){
    done(null, user.id)
})
passport.deserializeUser(function(id, done){
    db.oneOrNone(`SELECT id, name, username, salt, hash FROM players WHERE id = '${id}';`)
        .then(user => {
            done(null, user)
        })
        .catch(err => {
            done(err)
        })
})