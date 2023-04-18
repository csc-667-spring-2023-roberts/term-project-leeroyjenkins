const express = require("express");
const router = express.Router();
const db = require("../db/connection.js")

router.get("/", (req, res) => {
  res.render('home', {
    title: 'Justin Shin',
    message: 'this is a test'
  })
});

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) =>{
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  console.log(`Name: ${name}, Username: ${username}, Password: ${password}`);
  // Do something with the input values, such as saving to a database
  res.send('Registration successful!');
  db.any(`INSERT INTO players(id, name, username, password) VALUES
    (${name}, ${username}, ${password});
  `)
})

module.exports = router;