const express = require("express");
const router = express.Router();
// const db = require('../db/connection.js')
const game_table = require('../db/game_table.js')
const player_table = require('../db/player_table.js')
const players = require('../db/players.js')
const socketCalls = require('../sockets/constants')

router.get('/', async(req,res)=>{
    const userID = req.session.user.id
    const username = req.session.user.username
    try{
        const {wallet} = await players.getWallet(userID)

        try{
            const results = await game_table.getAllTables()
            try{
                const arrayOfTables = await player_table.getPlayersTables(req.session.user.id)
                const filteredResults = results.filter(table => arrayOfTables.some(t => t.table_id === table.id))
                const theRest = results.filter(table => !filteredResults.includes(table))
                // console.log("*arrayOfTables* :" + JSON.stringify(arrayOfTables))
                // console.log("*results*: " + JSON.stringify(results))
                res.render('home', {games: theRest, pgames: filteredResults, wallet: wallet, username: username})
            }catch(err){
                console.log(err)
            }
        }catch(err){
            console.log(err)
        }
    }catch(err){
        console.log(err)
    }
})

router.post('/logout', (req, res) =>{
    req.session.destroy((error)=>{
        console.log({error})
    })
    res.redirect('/')
})

module.exports = router