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
            const seat = r[0].seat
            try{ //game_status data
                let{round, pot, community, player_cards, player_chips, players_alive} = await game_status.getStatus(gameID)
                if(community !== undefined){
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
                        hand: player_cards[seat]
                    })
                    io.emit(socketCalls.ACTION_START_GAME, {gameID, seat: 1})
                }else{
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
                            console.log("gameID: "+gameID + ", type: " + typeof(gameID))
                            io.emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message, gameID, timestamp: Date.now()})
                            io.emit(socketCalls.PLAYER_JOINED_RECEIVED,{gameID,username})
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
            try{
                const {name, minimum, maximum, count, players} = await game_table.getData(gameID)
                const message = username + " has joined"
                io.emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message, gameID, timestamp: Date.now()})
            }catch(err){
                console.log(err)
            }
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
                const wallet = await players.getWallet(userID)
                const w = wallet[0].wallet
                try{ //update wallet
                    const newW = w - (minimum/2)
                    if(newW < minimum){
                        res.send('not enough funds')
                    }
                    await players.updateWallet(userID, newW)
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
                io.emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message, gameID, timestamp:Date.now()})
                io.emit(socketCalls.PLAYER_LEFT_RECEIVED,{gameID,username})
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