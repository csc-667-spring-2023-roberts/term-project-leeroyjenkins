const http = require('http')
const {Server} = require('socket.io')
const socketCalls = require('./constants')

const initSockets = (app, sessionMiddleware) =>{
    const server = http.createServer(app)
    const io = new Server(server)

    io.engine.use(sessionMiddleware)
    io.on('connection', (_socket) =>{
        _socket.on('join-game', (gameID) =>{
            _socket.join(`game-${gameID}`)
        })
        _socket.on(socketCalls.SYSTEM_MESSAGE_RECEIVED, ({message, gameId, timestamp})=>{
            console.log("system message recieved *1*")
            io.to(`game-${gameId}`).emit(socketCalls.SYSTEM_MESSAGE_RECEIVED, {message, timestamp})
        })
        
    })
    app.set('io', io)
    return server
}

module.exports = initSockets;