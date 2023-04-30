const express = require('express')
const router = express.Router()
const player_table = require('../db/player_table')
const game_table = require('../db/game_table')

router.get('/:gameID', async (req,res)=>{
    const{gameID} = req.params;
    const{value} = req.query;
    const userID = req.session.user.id
    try{
        const check = await player_table.checkPlayerInTable(gameID,userID)
        console.log('*gameid* check: ' + check + ', type of: ' + typeof(check))
        if(check.length === 0){
            try{
                await player_table.joinPlayerTable(userID, gameID, value)
                
                try{
                    let {minimum, maximum, count, players} = await game_table.getData(gameID)
                    count += 1
                    players.push(req.session.user.username)
                    try{
                        await game_table.updatePlayers(gameID,count,players)
                        res.render('game', {gameID})
                    }catch(error){
                        console.log('*game_table.updatePlayers* \n'+error)
                        res.send('*game_table.updatePlayers* \n'+error)
                    }
                }catch(error){
                    console.log('*game_table.getData* \n' + error)
                    res.send('*game_table.getData* \n' + error)
                }
            }catch(error){
                console.log('*player_table.joinPlayerTable*\n' + error)
                res.send('*player_table.joinPlayerTable*\n' + error)
            }
        }else{
            res.render('game', {gameID})
        }
        
    }catch(error){
        console.log('*player_table.checkPlayerInTable* : \n'+ error)
        res.send('*player_table.checkPlayerInTable* : \n'+ error)
    }
})

router.post('/:gameID/leave', async (req, res)=>{
    const userID = req.session.user.id
    const{gameID} = req.params
    try{
        player_table.leaveTable(userID)
        try{
            let {minimum, maximum, count, players} = await game_table.getData(gameID)
            const playerIndex = players.indexOf(req.session.user.username)
            if(playerIndex !== -1){
                players.splice(playerIndex,1)
                count -= 1
            }
            try{
                await game_table.updatePlayers(gameID, count, players)
                res.redirect('/home')
            }catch(error){
                console.log('*game_table.updatePlayers* \n'+error)
                res.send('*game_table.updatePlayers* \n'+error)
            }
        }catch(error){
            console.log('*game_table.getData* \n' + error)
            res.send('*game_table.getData* \n' + error)
        }
    }catch(error){
        console.log('*player_table.leaveTable*\n' + error)
        res.send('*player_table.leaveTable*\n' + error)
    }
})

module.exports = router;