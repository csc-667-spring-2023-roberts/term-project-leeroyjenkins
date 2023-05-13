const express = require("express");
const router = express.Router();
const players = require('../db/players.js')
const genPassword = require('../config/passwordUtils.js').genPassword
const validPassword = require('../config/passwordUtils.js').validPassword

router.get("/", (req, res) => {
  const {user} = req.session;
  if(user && user.id){
    res.redirect('/home')
  }else{
    res.redirect('/login')
  }
});

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) =>{
  const emailInput = req.body.email
  const pword = req.body.password
  try{
    console.log('*login* email: ' + emailInput)
    const player = await players.findByEmail(emailInput)
    const {id,username,email,hash,salt} = player[0]
    const valid = validPassword(pword, hash, salt)
    if(valid){
      req.session.user = {
        id,
        username,
        email,
      }
      res.redirect('/home')
    }else{
      res.render('login', {message: "Incorrect password"})
    }
  }catch(err){
    console.log(err)
    res.render('login', {message: "Email does not exist"})
  }
})

router.post('/register', async (req, res) =>{
  const {username, email, password} = req.body
  try{
    const p = await players.findByEmail(email)
    if(p.length > 0){
      //FIX LATER
      res.send('email in use')
    }else{
      const saltHash = genPassword(password)
      const salt = saltHash.salt
      const hash = saltHash.hash
      try{
        const{id} = await players.createPlayer(username, email, hash, salt)
        req.session.user={
          id,
          username,
          email,
        }
        res.redirect('/home')
      }catch(error){
        console.log('*REGISTER* error: '+error)
      }
    }
  }catch(error){
    console.log(error)
  }
})

module.exports = router;