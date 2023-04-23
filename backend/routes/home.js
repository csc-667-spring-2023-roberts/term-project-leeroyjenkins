const express = require("express");
const router = express.Router();
const db = require('../db/connection.js')

router.get('/', (req,res)=>{
    console.log('*HOME* req.session.user.username: ' + req.session.user.username)
    console.log('*HOME* req.session.user.id: ' + req.session.user.id)
    db.any(`SELECT * FROM game_table;`)
        .then((result) =>{
            console.log('*HOME* db result: '+result)
            console.log('*HOME* results[0].minimum: ' + result[0].minimum)
            const games = result
            res.render('home', {games})
        })
})

router.post('/logout', (req, res) =>{
    req.session.destroy((error)=>{
        console.log({error})
    })
    res.redirect('/')
})





module.exports = router