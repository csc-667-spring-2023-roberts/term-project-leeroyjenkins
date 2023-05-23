const express = require('express')
const router = express.Router()
const player_table = require('../db/player_table')
const game_table = require('../db/game_table')
const game_status = require('../db/game_status')
const players = require('../db/players')
const game = require('../config/myPoker')
const socketCalls = require('../sockets/constants')

router.get('/createTable', (req, res)=>{
    res.render('createTable')
})

router.post('/createTable', async(req, res, next)=>{
    const io=req.app.get('io')
    const {tname, min, max, plimit} = req.body
    const userID = req.session.user.id
    try{
        const t = await game_table.tableNameInUse(tname)
        if(t.length > 0){
            res.render('createTable', {
                message: 'Name is in use',
            });
        }else{
            const count = 1;
            const playerArray = [req.session.user.username]
            const tableID = await game_table.createTable(min, max, tname, plimit, count, playerArray)

            console.log("userid: " + userID)
            console.log("tableID: " + tableID.id)
            await player_table.joinPlayerTable(userID, tableID.id, count)
            io.emit(socketCalls.TABLE_UPDATE, {tableID: tableID, min: min, max:max, tname: tname, plimit: plimit,count: count})
            res.redirect(`/games/${tableID.id}`)
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error", error: err})
    }
})

router.get('/:gameID', async(req, res) =>{
    const {gameID} = req.params;
    const userID = req.session.user.id
    const username = req.session.user.username
    try{
        const playerSeat = await player_table.getSeatInTable(gameID, userID)
        const tableInfo = await game_table.getData(gameID)
        const wallet = await players.getWallet(userID)
        
        const seat = playerSeat[0].seat
        const min = tableInfo.minimum
        const max = tableInfo.maximum
        const lobby = tableInfo.players
        const tableName = tableInfo.name
        const plimit = tableInfo.plimit
        const dealer = tableInfo.dealer
        
        const statusInfo = await game_status.getStatus(gameID)
        let round
        let pot
        let community
        let cards
        let chips
        let alive
        let callAmount
        
        if(statusInfo.length > 0){
            round = parseInt(statusInfo[0].round)
            // console.log('round: ' + round + ', type: ' + typeof(round))
            pot = statusInfo[0].pot
            community = [statusInfo[0].community.slice(1,3),statusInfo[0].community.slice(4,6),statusInfo[0].community.slice(7,9),statusInfo[0].community.slice(10,12),statusInfo[0].community.slice(13,15)]
            // console.log("community: " + JSON.stringify(community) + ", type: " + typeof(community))
            cards = statusInfo[0].player_cards
            const hand = cards[seat-1]
            chips = statusInfo[0].player_chips
            alive = statusInfo[0].players_alive
            // console.log('alive' + alive + ', type: ' + typeof(alive))

            const raise = Math.max(...chips)
            if(raise < 0){
                let hotIndex = dealer
                while(chips[hotIndex] !== -2){
                   hotIndex = (hotIndex+1)%chips.length
                }
                const hotSeat = hotIndex+1
                if(hotSeat === seat){
                    callAmount = 0
                }else{
                    callAmount = -2
                }
            }else{
                let hotIndex
                for(let i=0; i<chips.length; i++){
                    if(chips[i] === raise){
                        let nextIndex = (i+1)%chips.length
                        while(chips[nextIndex] === -1){
                            nextIndex = (nextIndex+1)%chips.length
                            console.log("Next index: " + nextIndex)
                        }

                        if(chips[nextIndex] < chips[i]){
                            hotIndex = nextIndex
                            console.log('hot index: ' + hotIndex)
                        }
                    }
                }
                const hotSeat = hotIndex + 1
                if(hotSeat === seat){
                    if(raise === 0){
                        callAmount = 0
                    }else if(chips[hotIndex] === -2){
                        callAmount = raise 
                    }else{
                        callAmount = raise - chips[hotIndex]
                    }
                }else{
                    callAmount = -2
                }
            }

            res.render('game',{
                username: username,
                gameID: gameID,
                wallet: wallet.wallet,
                seat: seat,
                plimit: plimit,
                dealer: dealer,
                min: min,
                max: max,
                lobby: lobby,
                alive: alive,
                community: community,
                round: round,
                pot: pot,
                chips: (chips[seat-1] < 0)? 0 : chips[seat-1],
                hand: hand,
                callAmount: callAmount
            })
        }else{
            res.render('game',{
                username: username,
                gameID: gameID,
                wallet: wallet.wallet,
                seat: seat,
                plimit: plimit,
                dealer: dealer,
                min: min,
                max: max,
                lobby: lobby,
                round: -1,
                alive: [],
                community: [],
                pot: 0,
                chips: 0,
                hand: [],
                callAmount: -2
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error", error: err})
    }
})

router.post('/:gameID', async (req,res)=>{
    const io = req.app.get('io')
    const{gameID} = req.params;
    const userID = req.session.user.id
    const username = req.session.user.username

    const {wallet} = await players.getWallet(req.session.user.id)
    try{
        const check = await player_table.checkPlayerInTable(gameID,userID)
        if(check.length === 0){
            let {name, minimum, maximum, count, players, plimit, dealer} = await game_table.getData(gameID)
            if(count < plimit){
                count += 1
                const seats = await player_table.getAllSeats(gameID)
                const seatValues = seats.map(s => s.seat)
                const sortedSeatValues = seatValues.sort((a,b)=> a-b)
                let vacantSeat = 1;
                for(let i=0; i<sortedSeatValues.length; i++){
                    if(sortedSeatValues[i] === vacantSeat){
                        vacantSeat++
                    }
                }
                players.splice((vacantSeat-1),0,req.session.user.username)
                await game_table.updatePlayers(gameID,count,players)
                await player_table.joinPlayerTable(userID, gameID, vacantSeat)
                
                const message = "System: "+username + " has joined"
                io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message, gameID, timestamp: Date.now()})
                io.to(`game-${gameID}`).emit(socketCalls.PLAYER_JOINED_RECEIVED,{username})
                res.redirect(`/games/${gameID}`)
            }else{
                
                const results = await game_table.getAllTables()
                const arrayOfTables = await player_table.getPlayersTables(req.session.user.id)
                const filteredResults = results.filter(table => arrayOfTables.some(t => t.table_id === table.id))
                const theRest = results.filter(table => !filteredResults.includes(table))
                res.render('home', {games: theRest, pgames: filteredResults, wallet: wallet, username: username, message: `Game room ${name} is full`})
            }
        }else{
            res.redirect(`/games/${gameID}`)
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error", error: err})
    }
})

router.post('/:gameID/create', async(req, res)=>{
    const io = req.app.get('io')
    const {gameID} = req.params;
    const userID = req.session.user.id
    try{ //player count
        const table = await game_table.getData(gameID)

        const playerChips = new Array(table.count).fill(0)
        playerChips[table.dealer] = parseInt(table.minimum/2)
        
        const gameInfo = new game(table.count)
        const playerCards = gameInfo.getPlayerCards();
        // console.log('*playerCards* : ' + playerCards)
        const communityCards = gameInfo.getCommunity();
        // console.log('*communityCards* : ' + communityCards)
        const playerRanks = gameInfo.getRanks();
        // console.log('*playerRanks* : ' + playerRanks)
       
        await game_status.createStatus(gameID, parseInt(0), parseInt(table.minimum/2), communityCards, playerCards, playerChips, table.players, playerRanks)
        const wallet = await players.getWallet(userID)
        // console.log("*Create* wallet: " + JSON.stringify(wallet))
        const newW = wallet.wallet - (table.minimum/2)
        if(newW < table.minimum){
            res.send('not enough funds')
        }
        const bigBlindIndex = (table.dealer+1)%table.count
        const bigBlindSeat = bigBlindIndex+1
        const smallBlindSeat = (table.dealer+1)
        // console.log('smallBlindSeat: ' + smallBlindSeat)
        // console.log('bigBlindSeat: ' + bigBlindSeat)
        await players.updateWallet(userID, newW)
        res.status(200).json({message:'Success'})
        io.to(`game-${gameID}`).emit(socketCalls.REFRESH_GAME,{})
        io.to(`game-${gameID}`).emit(socketCalls.LOAD_PLAYERS,{players: table.players})
        io.to(`game-${gameID}-${smallBlindSeat}`).emit(socketCalls.UPDATE_CHIPS,{chips: table.minimum/2, cash:newW})
        io.to(`game-${gameID}-${smallBlindSeat}`).emit(socketCalls.GAME_DEAL_CARDS,{cards:playerCards[table.dealer]})
        io.to(`game-${gameID}-${bigBlindSeat}`).emit(socketCalls.ACTION_PAY_BIG_BLIND,{callAmount:table.minimum, cards:playerCards[bigBlindIndex]})
        for(let i=0; i<table.count-2; i++){
            const pIndex = (bigBlindIndex+1+i)%table.count
            io.to(`game-${gameID}-${pIndex+1}`).emit(socketCalls.GAME_DEAL_CARDS,{cards:playerCards[pIndex]})
        }

        
        io.to(`game-${gameID}`).emit(socketCalls.UPDATE_POT,{pot: table.minimum/2})

    }catch(err){
        console.log("*Create Game* caught game_table.getData error")
        console.log(err)
        res.status(500).json({message: "Internal Server Error", error: err})
    }
})

router.post('/:gameID/bet', async(req, res)=>{
    const io=req.app.get('io')
    const {gameID} = req.params
    const username = req.session.user.username
    const userID = req.session.user.id
    const {bet} = req.body

    let message
    if(bet > 0){
        message = `${username} bets $${bet}`
    }else{
        message = `${username} calls`
    }
    io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message:`System: ${username} bets $${bet}`, timestamp:Date.now()})
    // console.log('bet: ' + bet)
    try{
        // check if funds exist in players
        const wallet = await players.getWallet(userID)
        // console.log("Wallet: " + wallet.wallet + ', type: ' + typeof(wallet.wallet))
        if(parseInt(bet) < wallet.wallet){
            const w = wallet.wallet - parseInt(bet)
            // subtract bet from player in players and update new wallet
            await players.updateWallet(userID, w)
            // get status
            const g = await game_status.getStatus(gameID)
            const chips = g[0].player_chips
            const pot = parseInt(g[0].pot) + parseInt(bet)
            const alive = g[0].players_alive
            const x = alive.indexOf(username)
            if(parseInt(bet) > 0){
                if(chips[x] === -2){
                    chips[x] += parseInt(bet) + 2
                }else{
                    chips[x] += parseInt(bet)
                } 
            }else{
                chips[x] = 0
            }
            // add bet to game_status.player_chips and game_status.pot
            await game_status.playerBets(gameID, chips, pot)
            io.to(`game-${gameID}`).emit(socketCalls.UPDATE_POT,{pot: pot})
            io.to(`game-${gameID}-${x+1}`).emit(socketCalls.UPDATE_CHIPS,{chips: chips[x],cash: w})
            // check: next player
            const recentBet = chips[x]
            let index = (x+1)%chips.length
            let proceed = true
            while(index !== x){
                const currentBet = chips[index]
                if((currentBet !== -1 && currentBet < recentBet) || currentBet === -2){
                    let diff = recentBet - currentBet
                    if(currentBet === -2){
                        diff = diff-2 
                    }
                    proceed = false
                    io.to(`game-${gameID}-${index+1}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: diff, bigBlind: false})
                    res.status(200).json({message:'Success'})
                    break
                }
                index = (index+1)%chips.length
            }
            // all players called
            if(proceed){
                startNewRound(req, res)
            }
        }else{
            console.log('insufficient funds')
            res.status(400).json({message: "Not Acceptable, Player has Insufficient Funds"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error", error: err})
    }
})

const startNewRound = async(req,res) =>{
    const io=req.app.get('io')
    const {gameID} = req.params
    try{
        const info = await game_table.getData(gameID)
        const g = await game_status.getStatus(gameID)
        const chips = g[0].player_chips
        // console.log('info: ' + JSON.stringify(info))
        // console.log("Dealer: " + nextSeat)
        const round = parseInt(g[0].round) + 1
        // console.log("New round: " + round)
        await game_status.updateRound(gameID, round)
        if(round === 1){
            for(let i=0; i<chips.length; i++){
                if(chips[i] !== -1){
                    chips[i] = -2
                }
            }
            await game_status.updateChips(gameID, chips)
            io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message: "System: First round of betting concluded", timestamp: Date.now()})
            io.to(`game-${gameID}`).emit(socketCalls.GAME_FLOP,{cards: [g[0].community.slice(1,3),g[0].community.slice(4,6),g[0].community.slice(7,9)]})
            io.to(`game-${gameID}-${info.dealer+1}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: 0, bigBlind: false})
            res.status(200).json({message:'Success'})
        }else if(round === 2){
            for(let i=0; i<chips.length; i++){
                if(chips[i] !== -1){
                    chips[i] = -2
                }
            }
            await game_status.updateChips(gameID, chips)
            io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message: "System: Second round of betting concluded", timestamp: Date.now()})
            io.to(`game-${gameID}`).emit(socketCalls.GAME_TURN_RIVER,{card: g[0].community.slice(10,12)})
            io.to(`game-${gameID}-${info.dealer+1}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: 0, bigBlind: false})
            res.status(200).json({message:'Success'})
        }else if(round === 3){
            for(let i=0; i<chips.length; i++){
                if(chips[i] !== -1){
                    chips[i] = -2
                }
            }
            await game_status.updateChips(gameID, chips)
            io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message: "System: Third round of betting concluded", timestamp: Date.now()})
            io.to(`game-${gameID}`).emit(socketCalls.GAME_TURN_RIVER,{card: g[0].community.slice(13,15)})
            io.to(`game-${gameID}-${info.dealer+1}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: 0, bigBlind: false})
            res.status(200).json({message:'Success'})
        }else if(round === 4){
            io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message: "System: Fourth and final round of betting concluded", timestamp: Date.now()})
            handleGameEnd(req,res)
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error", error: err})
    }
}

const handleGameEnd = async(req, res) =>{
    const io=req.app.get('io')
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

        const pID = await player_table.getPIDFromTableSeat(gameID, winningSeat)
        console.log("pID: " + JSON.stringify(pID))

        const wallet = await players.getWallet(pID[0].player_id)
        console.log("wallet: " + JSON.stringify(wallet))

        const wallet2 = parseInt(wallet.wallet) + parseInt(status[0].pot)
        await players.updateWallet(pID[0].player_id, wallet2)
        io.to(`game-${gameID}-${winningSeat}`).emit(socketCalls.GAME_UPDATE_PLAYER_CASH,{cash: wallet2})

        const table = await game_table.getDealerPlimit(gameID)
        const newDealer = (table.dealer+1)%table.count
        const nextSeat = newDealer+1
        console.log("Next seat: " + nextSeat)
        await game_table.updateDealer(gameID, newDealer)
        await game_status.deleteStatus(gameID)

        const remainingPlayers = {}
        for(let i=0; i<status[0].player_chips.length; i++){
            console.log("status[0].player_chips[i]: "+ status[0].player_chips[i])
            if(status[0].player_chips[i] !== -1){
                // remainingPlayers.set(status[0].players_alive[i], status[0].player_cards[i])
                remainingPlayers[status[0].players_alive[i]] = status[0].player_cards[i]
            }
        }
        console.log("remaining Players; " + JSON.stringify(remainingPlayers))
        io.to(`game-${gameID}`).emit(socketCalls.GAME_ENDS_SHOW_CARDS,{remaining: remainingPlayers})

        const message = `System: Game Over.  ${wallet.username} wins $${status[0].pot}`
        io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message: message, timestamp: Date.now()})
        io.to(`game-${gameID}-${nextSeat}`).emit(socketCalls.ACTION_START_GAME,{})

        res.status(200).json({message:'Success'})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error", error: err})
    }
}

const playerFOLDS = async(req, res) =>{
    const io=req.app.get('io')
    const {gameID} = req.params
    const username = req.session.user.username
    io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message: `System: ${username} has folded`, timestamp:Date.now()})
    try{
        const g = await game_status.getStatus(gameID)
        if(g.length !== 0){
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
            await game_status.playerFolds(gameID, alive, ranks, chips)
            
            io.to(`game-${gameID}`).emit(socketCalls.PLAYER_FOLDS,{username: username})

            let count = 0
            for(let i=0; i<alive.length; i++){
                console.log('alive[i]: ' + alive[i] + typeof(alive[i]))
                if(alive[i] !== 'folded'){
                    count ++
                }
            }
            if(count === 1){
                handleGameEnd(req,res)
            }else{
                const raise = Math.max(...chips)
                const nextBetIndex = (x+1)%chips.length
                let diff
                if(raise === chips[nextBetIndex]){
                    startNewRound(req,res)
                }else if(chips[nextBetIndex] === -2){
                    diff = raise-chips[nextBetIndex]-2
                    io.to(`game-${gameID}-${nextBetIndex+1}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: diff, bigBlind: false})
                }else{
                    diff = raise-chips[nextBetIndex]
                    io.to(`game-${gameID}-${nextBetIndex+1}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: diff, bigBlind: false})
                }
            }
        }

    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error", error: err})
    }
}

router.post('/:gameID/fold', (req,res)=>{
    playerFOLDS(req,res)
    res.status(200).json({message: 'Success'})
})

router.post('/:gameID/leave', async (req, res)=>{
    const io=req.app.get('io')
    const userID = req.session.user.id
    const username = req.session.user.username
    const {gameID} = req.params
    try{
        player_table.leaveTable(userID, gameID)
        let {name, minimum, maximum, count, players, plimit, dealer} = await game_table.getData(gameID)
        const playerIndex = players.indexOf(username)
        players.splice(playerIndex,1)
        count -= 1
        await game_table.updatePlayers(gameID, count, players)
        
        

        playerFOLDS(req, res)
        const message = "System: "+req.session.user.username + ' has left'
        io.to(`game-${gameID}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED,{message, timestamp: Date.now()})
        io.to(`game-${gameID}`).emit(socketCalls.PLAYER_LEFT_RECEIVED,{username})
        
        res.redirect('/home')
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error", error: err})
    }
})

// router.post('/:gameID/testSocket', (req,res)=>{
//     console.log("*games/testSocket*")
//     const io=req.app.get('io')
//     const {gameID} = req.params
//     const seat = 1
//     io.to(`game-${gameID}-${seat}`).emit(socketCalls.ACTION_PLAYERS_TURN,{callAmount: 10, bigBlind:false})
//     res.status(200).json({message:'Success'})
// })

module.exports = router;