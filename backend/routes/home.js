const express = require("express");
const router = express.Router();
const db = require('../db/connection.js')
const isAuth = require('./middleware/authorized.js').isAuth

router.get('/', (req,res)=>{
    console.log('*HOME* req.user: ' + req.user)
    console.log('*HOME* req.isAuthenticated(): ' + req.isAuthenticated())
    db.any(`SELECT * FROM game_table;`)
        .then((result) =>{
            console.log('*HOME* db result: '+result)
            console.log('*HOME* results[0].minimum: ' + result[0].minimum)
            const games = result
            res.render('home', {games})
        })
})

router.post('/logout', (req, res) =>{
    req.logout(() =>{
        res.redirect('/login')
    })
})





module.exports = router