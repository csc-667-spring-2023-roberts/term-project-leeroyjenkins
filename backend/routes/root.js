const express = require("express");
const router = express.Router();
const db = require("../db/connection.js")
const passport = require('passport')
const genPassword = require('../config/passwordUtil.js').genPassword
const isAuth = require('./middleware/authorized.js').isAuth

router.get("/", (req, res) => {
  res.redirect('/login')
});

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

// router.post('/login', passport.authenticate('local',{
//   successRedirect: '/home',
//   failureRedirect: '/login'
// }))
router.post('/login', (req,res,next) =>{
  passport.authenticate('local', (err, user, info) =>{
    if(err) {
      console.log(err)
      return next(err)
    }
    if(!user){
      return res.redirect('/login-failure')
    }
    req.logIn(user, (err)=>{
      if(err){
        console.log(err)
        return next(err)
      }
      console.log('*LOGIN* req.session: '+req.session)
      console.log('*LOGIN* req.user.id: ' + req.user.id)
      console.log('*LOGIN* req.isAuthenticated(): ' + req.isAuthenticated())
      req.session.save(()=>{
        res.redirect('/home')
      })
    })
  })(req,res,next)
})


router.post('/register', (req, res) =>{
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  console.log(`name: ${name}, username: ${username}, password: ${password}`)
  
  db.any(`SELECT * FROM players WHERE username = $1`, [username])
    .then((result) => {
      if(result.length === 0){
        const saltHash = genPassword(password)
        const salt = saltHash.salt
        const hash = saltHash.hash

        db.any(`INSERT INTO players(name, username, hash, salt) VALUES
          ($1,$2,$3,$4);`, [name, username, hash, salt])
        .then(()=>{
            res.redirect('/login')
          })
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


module.exports = router;