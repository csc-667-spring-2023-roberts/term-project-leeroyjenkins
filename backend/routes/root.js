const express = require("express");
const router = express.Router();
const players = require('../db/players.js')
const genPassword = require('../config/passwordUtils.js').genPassword
const validPassword = require('../config/passwordUtils.js').validPassword

router.get("/", (req, res) => {
  res.redirect('/login')
});

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) =>{
  const email = req.body.email
  const pword = req.body.password
  try{
    const{id, username, hash, salt} = await players.findByEmail(email)
    const valid = validPassword(pword, hash, salt)
    if(valid){
      req.session.user = {
        id,
        username,
        email,
      }
      res.redirect('/home')
    }else{
      res.send('valid not true')
    }
  }catch(err){
    console.log(err)
    res.send('error with post/login try catch')
  }
})

router.post('/register', async (req, res) =>{
  const {username, email, password} = req.body
  try{
    const p = await players.findByEmail(email)
    if(p.length > 0){
      res.send('email in use')
    }
  }catch(error){
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
})

module.exports = router;