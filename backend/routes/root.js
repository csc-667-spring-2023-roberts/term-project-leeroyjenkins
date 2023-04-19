const express = require("express");
const router = express.Router();
const db = require("../db/connection.js")
const passport = require('passport')
const genPassword = require('../config/passwordUtil.js').genPassword
const isAuth = require('./middleware/authorized.js').isAuth

router.get("/", (req, res) => {
  res.render('home', {
    title: 'Justin Shin',
    message: 'this is a test'
  })
});

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login-failure',
  successRedirect: '/login-success',
}),(err, req, res, next)=>{
  console.log(req.body)
  if(err){
    console.log(err)
    next(err)
  }
})

router.post('/register', (req, res) =>{
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  
  db.any(`SELECT * FROM players WHERE username = '${username}'`)
    .then((result) => {
      if(result.length === 0){
        const saltHash = genPassword(password)
        const salt = saltHash.salt
        const hash = saltHash.hash

        db.any(`INSERT INTO players(name, username, hash, salt) VALUES
          (${name}, ${username}, ${salt}, ${hash});
        `)
        .catch((error) => {
          res.send('Error saving user in database')
          console.log(error)
        })

      }
    })
    .catch((error) => {
      res.send('Error looking up users')
      console.log(error)
    })
})

router.get('/testingtesting', (req, res) =>{
  const uname = "JShin"
  db.any(`SELECT * FROM players WHERE username = '${uname}';`)
    .then((results) => {
      res.send(results)
      console.log(results[0].name)
    })
    .catch((error) => {
      console.log(error)
    })
})

module.exports = router;