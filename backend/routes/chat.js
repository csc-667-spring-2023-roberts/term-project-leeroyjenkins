const express = require('express');
const router = express.Router()
const constants = require('../sockets/constants')

router.post('/:id', (req, res, next) =>{
    const io = req.app.get('io');
    const {message} = req.body;
    const {username} = req.session.user;
    // console.log("*chat* message: " + message)

    io.emit(constants.CHAT_MESSAGE_RECEIVED, {message,username,timestamp: Date.now()})

    res.status(200).json({message: "Success"})
})

router.post('/game/:gameID',(req,res)=>{
    io = req.app.get('io')
    const {message} = req.body
    const {username} = req.session.user;
    const {gameID} = req.params;

    const m = `${username}: ${message}`
    io.to(`game-${gameID}`).emit(constants.SYSTEM_MESSAGE_RECEIVED,{message: m, timestamp: Date.now()})

    res.status(200).json({message: "Success"})
})



module.exports = router;