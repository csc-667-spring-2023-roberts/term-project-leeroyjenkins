const localStrategy = require('passport-local').Strategy
const db = require('../db/connection.js')
const validPassword = require('./passwordUtil.js').validPassword

module.exports = function(passport){
    passport.use(new localStrategy(function verify(username,password,cb){
        db.any(`SELECT * FROM players WHERE username = '${username}';`)
            .then((results) => {
                if(results.length == 0){
                    return cb(null, false)
                }
                const isValid = validPassword(password, results[0].hash, results[0].salt)
                if(isValid){return cb(null, results[0])}
                else{return cb(null, false)}
            }).catch((error)=>{
                console.log(error)
                cb(error)
            })
    }))
    passport.deserializeUser((id, done)=>{
        console.log('!!!!!!!!!!!!!!!!!!!!!!!deserialize: ' + id)
        db.any(`SELECT * FROM players WHERE id = '${id}'`)
            .then((results) =>{
                if(results.length == 0){
                    return done(null, false)
                }
                const user = results[0]
                return done(null, user)
            })
            .catch((error) =>{
                return done(error)
            })
    })
    passport.serializeUser((userObj, done) =>{
        console.log('*passport.js* serializeUser: ' + userObj.id)
        done(null, userObj.id);
    })
}