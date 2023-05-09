const express = require("express");
const router = express.Router();
// const db = require('../db/connection.js')
const game_table = require('../db/game_table.js')
const player_table = require('../db/player_table.js')
const players = require('../db/players.js')


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

router.get('/createTable', (req, res)=>{
    res.render('createTable')
})

router.post('/createTable', async(req, res, next)=>{
    const {tname, min, max, plimit} = req.body
    const userID = req.session.user.id
    try{
        const t = await game_table.tableNameInUse(tname)
        if(t.length > 0){
            //FIX LATER
            res.send('name in use')
        }else{
            try{
                const count = 1;
                const playerArray = [req.session.user.username]
                const tableID = await game_table.createTable(min, max, tname, plimit, count, playerArray)
                try{
                    console.log("userid: " + userID)
                    console.log("tableID: " + tableID.id)
                    await player_table.joinPlayerTable(userID, tableID.id, count)
                    res.redirect(`/games/${tableID.id}`)
                }catch(error){
                    console.log('*player_table.joinPlayerTable*\n' + error)
                    res.send('*player_table.joinPlayerTable*\n' + error)
                }
            }catch(err){
                console.log(err)
            }
        }
    }catch(err){
        console.log(err)
    }
})

module.exports = router