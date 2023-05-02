const express = require("express");
const router = express.Router();
// const db = require('../db/connection.js')
const game_table = require('../db/game_table.js')
const player_table = require('../db/player_table.js')

router.get('/', async(req,res)=>{
    // // console.log('*HOME* req.session.user.username: ' + req.session.user.username)
    // // console.log('*HOME* req.session.user.id: ' + req.session.user.id)
    // db.any(`SELECT * FROM game_table;`)
    //     .then((result) =>{
    //         // console.log('*HOME* db result: '+result)
    //         // console.log('*HOME* results[0].minimum: ' + result[0].minimum)
    //         const games = result
    //         res.render('home', {games})
    //     })
    try{
        const results = await game_table.getAllTables()
        try{
            const arrayOfTables = await player_table.getPlayersTables(req.session.user.id)
            const filteredResults = results.filter(table => arrayOfTables.some(t => t.table_id === table.id))
            const theRest = results.filter(table => !filteredResults.includes(table))
            // console.log("*arrayOfTables* :" + JSON.stringify(arrayOfTables))
            // console.log("*results*: " + JSON.stringify(results))
            res.render('home', {games: theRest, pgames: filteredResults})
        }catch(err){

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

router.post('/createTable', async(req, res)=>{
    const {name, min, max, plimit} = req.body
    try{
        const t = await game_table.tableNameInUse(name)
        if(t.length > 0){
            //FIX LATER
            res.send('name in use')
        }else{
            try{
                const tableID = await game_table.createTable(min, max, name, plimit)
                console.log("*tableID*: " + JSON.stringify(tableID))
                res.redirect(`/games/${tableID.id}`)
            }catch(err){
                console.log(err)
            }
        }
    }catch(err){
        console.log(err)
    }
})






module.exports = router