const express = require('express')
const router = express.Router()
const player_table = require('../db/player_table')
const game_table = require('../db/game_table')
const game_status = require('../db/game_status')
const players = require('../db/players')
const game = require('../config/myPoker')
const socketCalls = require('../sockets/constants')

router.get('/:gameID', async(req, res) =>{
    const io = req.app.get('io')
    const {gameID} = req.params;
    const userID = req.session.user.id
    const username = req.session.user.username
    
    try{ //game_table data
        let {name, minimum, maximum, count, players, plimit} = await game_table.getData(gameID)
        try{ //player_table data
            const r = await player_table.getSeatInTable(gameID, userID)
            console.log('*r* :' + JSON.stringify(r))
            const seat = r[0].seat
            try{ //game_status data
                const g = await game_status.getStatus(gameID)
                console.log('*THE GAME*\n' + JSON.stringify(g))
                const community = g[0].community
                const pot = g[0].pot
                const hand = g[0].player_cards[seat-1]
                const chips = g[0].player_chips[seat-1]
                const players_alive = g[0].players_alive
                if(community !== undefined){
                    console.log("Game undefined")
                    res.render('game',{
                        gameID: gameID,
                        seat: seat,
                        plimit: plimit,
                        min: minimum,
                        max: maximum,
                        players_in_game: players,
                        players_alive: players_alive,
                        community: community,
                        pot: pot,
                        chips: chips,
                        hand: hand
                    })
                }else{
                    console.log("Game undefined")
                    res.render('game',{
                        gameID: gameID,
                        seat: seat,
                        plimit: plimit,
                        min: minimum,
                        max: maximum,
                        players_in_game: players,
                        players_alive: '',
                        community: '',
                        pot: '',
                        chips: 0,
                        hand: ''
                    })
                }
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

router.post('/:gameID', async (req,res)=>{
    const io = req.app.get('io')
    const{gameID} = req.params;
    const userID = req.session.user.id
    const username = req.session.user.username
    try{
        const check = await player_table.checkPlayerInTable(gameID,userID)
        if(check.length === 0){
            try{
                let {name, minimum, maximum, count, players, plimit} = await game_table.getData(gameID)
                if(count < plimit){
                    count += 1
                    players.push(req.session.user.username)
                    try{
                        await game_table.updatePlayers(gameID,count,players)
                        try{
                            await player_table.joinPlayerTable(userID, gameID, count)
                            const message = username + " has joined"
                            io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message, timestamp: Date.now()})
                            io.to(`game-${gameID}`).emit(socketCalls.PLAYER_JOINED_RECEIVED,{username})
                            res.redirect(`/games/${gameID}`)
                        }catch(error){
                            console.log('*player_table.joinPlayerTable*\n' + error)
                            res.send('*player_table.joinPlayerTable*\n' + error)
                        }
                        
                    }catch(error){
                        console.log('*game_table.updatePlayers* \n'+error)
                        res.send('*game_table.updatePlayers* \n'+error)
                    }
                }else{
                    //Change later
                    res.send('lobby full')
                }
            }catch(error){
                console.log('*game_table.getData* \n' + error)
                res.send('*game_table.getData* \n' + error)
            }
            
        }else{
            res.redirect(`/games/${gameID}`)
        }
    }catch(error){
        console.log('*player_table.checkPlayerInTable* : \n'+ error)
        res.send('*player_table.checkPlayerInTable* : \n'+ error)
    }
})

router.post('/:gameID/create', async(req, res)=>{
    const io = req.app.get('io')
    const {gameID} = req.params;
    const userID = req.session.user.id
    try{ //player count
        let {name, minimum, maximum, count, players, plimit} = await game_table.getData(gameID)
        const playerChips = new Array(count).fill(0)
        const gameInfo = new game(count)
        const playerCards = gameInfo.getPlayerCards();
        console.log('*playerCards* : ' + playerCards)
        const communityCards = gameInfo.getCommunity();
        console.log('*communityCards* : ' + communityCards)
        const playerRanks = gameInfo.getRanks();
        console.log('*playerRanks* : ' + playerRanks)
        try{ //create status
            await game_status.createStatus(gameID, 0, 0, communityCards, playerCards, playerChips, players)
            try{ //get wallet
                const {wallet} = await players.getWallet(userID)
                console.log("*Create* wallet: " + wallet)
                try{ //update wallet
                    const newW = wallet - (minimum/2)
                    if(newW < minimum){
                        res.send('not enough funds')
                    }
                    await players.updateWallet(userID, newW)
                    console.log("Everything seems good to me!")
                }catch(err){
                    console.log(err)
                }
            }catch(error){
                console.log(error)
            }
        }catch(err){
            console.log(err)
        }
    }catch(err){
        console.log(err)
    }
})

router.post('/:gameID/leave', async (req, res)=>{
    const io=req.app.get('io')
    const userID = req.session.user.id
    const username = req.session.user.username
    const{gameID} = req.params
    try{
        player_table.leaveTable(userID, gameID)
        try{
            let {name, minimum, maximum, count, players, plimit} = await game_table.getData(gameID)
            const player = req.session.user.username
            var playerIndex = players.indexOf(player)
            while(playerIndex !== -1){
                players.splice(playerIndex,1)
                count -= 1
                playerIndex = players.indexOf(player)
            }
            try{
                await game_table.updatePlayers(gameID, count, players)
                const message = req.session.user.username + ' has left'
                io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message, timestamp:Date.now()})
                io.to(`game-${gameID}`).emit(socketCalls.PLAYER_LEFT_RECEIVED,{username})
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