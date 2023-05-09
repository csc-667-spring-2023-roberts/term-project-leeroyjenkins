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
        let {name, minimum, maximum, count, players, plimit, dealer} = await game_table.getData(gameID)
        try{ //player_table data
            const r = await player_table.getSeatInTable(gameID, userID)
            // console.log('*r* :' + JSON.stringify(r))
            const seat = r[0].seat
            try{ //game_status data
                const g = await game_status.getStatus(gameID)
                // console.log('*THE GAME*\n' + JSON.stringify(g))
                if(g.length !== 0){
                    // console.log("Game defined")
                    let community
                    const round = g[0].round
                    const pot = g[0].pot
                    let hand
                    const chips = g[0].player_chips[seat-1]
                    const players_alive = g[0].players_alive
                    const player_ranks = g[0].player_ranks
                    if(round === 0){
                        community = ''
                        if(!(seat === (dealer)%plimit && chips[seat] < minimum) && !(seat === (dealer)%plimit && chips[seat] < minimum)){
                            //if big or small blind hasn't been paid
                            hand = g[0].player_hands[seat-1]
                        }else{
                            hand = ''
                        }
                    }else if(round === 1){
                        community = g[0].community.slice(0,3)
                        hand = g[0].player_hands[seat-1]
                    }else if(round === 2){
                        community = g[0].community.slice(0,4)
                        hand = g[0].player_hands[seat-1]
                    }else if(round === 3){
                        community = g[0].community
                        hand = g[0].player_hands[seat-1]
                    }
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
                let {name, minimum, maximum, count, players, plimit, dealer} = await game_table.getData(gameID)
                if(count < plimit){
                    count += 1
                    players.push(req.session.user.username)
                    try{
                        await game_table.updatePlayers(gameID,count,players)
                        try{
                            await player_table.joinPlayerTable(userID, gameID, count)
                            const message = username + " has joined"
                            // io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message, gameID, timestamp: Date.now()})
                            // io.to(`game-${gameID}`).emit(socketCalls.PLAYER_JOINED_RECEIVED,{username})
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
        let {name, minimum, maximum, count, players, plimit, dealer} = await game_table.getData(gameID)
        const playerChips = new Array(count).fill(0)
        const gameInfo = new game(count)
        const playerCards = gameInfo.getPlayerCards();
        console.log('*playerCards* : ' + playerCards)
        const communityCards = gameInfo.getCommunity();
        console.log('*communityCards* : ' + communityCards)
        const playerRanks = gameInfo.getRanks();
        console.log('*playerRanks* : ' + playerRanks)
        try{ //create status
            await game_status.createStatus(gameID, 0, 0, communityCards, playerCards, playerChips, players, playerRanks)
            try{ //get wallet
                const {wallet} = await players.getWallet(userID)
                console.log("*Create* wallet: " + wallet)
                try{ //update wallet
                    const newW = wallet - (minimum/2)
                    if(newW < minimum){
                        res.send('not enough funds')
                    }
                    await players.updateWallet(userID, newW)
                    io.to(`game-${gameID}-2`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount:minimum, bigBlind: true})
                    res.status(200)
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

router.post('/:gameID/bet', async(req, res)=>{
    const {gameID} = req.params
    const username = req.session.user.username
    const userID = req.session.user.id
    const {bet} = req.body
    console.log("bet: " + bet + typeof(bet))
    try{
        // check if funds exist in players
        const wallet = await players.getWallet(userID)
        console.log("Wallet: " + wallet.wallet + ', type: ' + typeof(wallet.wallet))
        if(bet < wallet.wallet){
            const w = wallet.wallet - bet
            try{
                // subtract bet from player in players and update new wallet
                await players.updateWallet(userID, w)
                try{
                    // get status
                    const g = await game_status.getStatus(gameID)
                    const chips = g[0].player_chips
                    const pot = g[0].pot + bet
                    const alive = g[0].players_alive
                    const x = alive.indexOf(username)
                    chips[x] += bet
                    try{
                        // add bet to game_status.player_chips and game_status.pot
                        await game_status.playerBets(gameID, chips, pot)
                        res.status(200)
                        console.log("BET SUCCESS")
                        // check: next player
                        const recentBet = chips[x]
                        let index = x+1
                        while(index !== x){
                            if(index >= chips.length){
                                index = 0
                            }
                            const currentBet = chips[index]
                            if(currentBet !== -1 && currentBet < recentBet){
                                io.to(`game-${gameID}-${index+1}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: recentBet - currentBet, bigBlind: false})
                                res.status(200)
                                return
                            }
                            index ++
                        }
                        // all players called
                        try{
                            const info = await game_table.getData(gameID)
                            const nextSeat = (info[0].dealer+1)%info[0].plimit
                            const round = info[0].round + 1
                            if(round === 1){
                                io.to(`game-${gameID}`).emit(socketCalls.GAME_FLOP,{cards: g[0].community.slice(0,3)})
                                io.to(`game-${gameID}-${nextSeat}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: 0, bigBlind: false})
                                res.status(200)
                            }else if(round === 2){
                                io.to(`game-${gameID}`).emit(socketCalls.GAME_TURN_RIVER,{card: g[0].community[3]})
                                io.to(`game-${gameID}-${nextSeat}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: 0, bigBlind: false})
                                res.status(200)
                            }else if(round === 3){
                                io.to(`game-${gameID}`).emit(socketCalls.GAME_TURN_RIVER,{card: g[0].community[4]})
                                io.to(`game-${gameID}-${nextSeat}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: 0, bigBlind: false})
                                res.status(200)
                            }else if(round === 4){
                                handleGameEnd(req,res)
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
            }catch(err){
                console.log(err)
            }
        }else{
            console.log('insufficient funds')
        }
    }catch(err){
        console.log(err)
    }

})

const handleGameEnd = async(req, res) =>{
    const {gameID} = req.params
    try{
        const status = await game_status.getStatus(gameID)
        const player_ranks = status[0].player_ranks
        let winningIndex = 0
        for(let i=0; i<player_ranks.length; i++){
            if(player_ranks[winningIndex] < player_ranks[i]){
                winningIndex = i
            }
        }
        const winningSeat = winningIndex + 1
        try{
            const pID = await player_table.getPIDFromTableSeat(gameID, winningSeat)
            try{
                const wallet = await players.getWallet(pID)
                try{
                    const wallet2 = wallet[0].wallet + status[0].pot
                    await players.updateWallet(pID, wallet2)
                    res.status(200)
                }catch(err){
                    console.log(err)
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
}

const playerFOLDS = async(req, res) =>{
    const {gameID} = req.params
    const username = req.session.user.username
    try{
        const g = await game_status.getStatus(gameID)
        if(g){
            const ranks = g[0].player_ranks
            const alive = g[0].players_alive
            const chips = g[0].player_chips
            const x = alive.indexOf(username)
            if(x !== -1){
                alive[x] = 'folded'
                ranks[x] = 0
                chips[x] = -1
            }else{
                console.log('*playerFOLDS* player not in game')
            }
            try{
                await game_status.playerFolds(gameID, alive, ranks, chips)
                console.log("FOLD SUCCESS")
                //NEED TO HANDLE GAME END
            }catch(err){
                console.log(err)
            }
        }
    }catch(err){
        console.log(err)
    }
}

router.post('/:gameID/fold', (req,res)=>{
    playerFOLDS(req,res)
})

router.post('/:gameID/leave', async (req, res)=>{
    const io=req.app.get('io')
    const userID = req.session.user.id
    const username = req.session.user.username
    const{gameID} = req.params
    try{
        player_table.leaveTable(userID, gameID)
        try{
            let {name, minimum, maximum, count, players, plimit, dealer} = await game_table.getData(gameID)
            const player = req.session.user.username
            var playerIndex = players.indexOf(player)
            while(playerIndex !== -1){
                players.splice(playerIndex,1)
                count -= 1
                playerIndex = players.indexOf(player)
            }
            try{
                await game_table.updatePlayers(gameID, count, players)
                playerFOLDS(req, res)
                const message = req.session.user.username + ' has left'
                // io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message, gameID, timestamp: Date.now()})
                // io.to(`game-${gameID}`).emit(socketCalls.PLAYER_LEFT_RECEIVED,{username})
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

router.post('/:gameID/testSocket', (req,res)=>{
    console.log("*games/testSocket*")
    const io=req.app.get('io')
    const {gameID} = req.params
    const message = "*SEND SYSTEM MESSAGE TEST*"
    const seat = 1
    //io.to(`game-${gameID}-${seat}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message, timestamp: Date.now()})
    io.to(`game-${gameID}-${seat}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: 10, bigBlind: false})
    
    res.status(200)
})

module.exports = router;