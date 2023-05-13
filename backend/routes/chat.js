const express = require('express');
const router = express.Router()
const constants = require('../sockets/constants')

router.post('/:id', (req, res, next) =>{
    const io = req.app.get('io');
    const {message} = req.body;
    const {username} = req.session.user;
    // console.log("*chat* message: " + message)

    io.emit(constants.CHAT_MESSAGE_RECEIVED, {message,username,timestamp: Date.now()})

    res.status(200)
})



module.exports = router;