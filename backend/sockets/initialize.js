const http = require('http')
const {Server} = require('socket.io')
const socketCalls = require('./constants')

const initSockets = (app, sessionMiddleware) =>{
    const server = http.createServer(app)
    const io = new Server(server)

    io.engine.use(sessionMiddleware)
    io.on('connection', (_socket) =>{
        _socket.on('join-seat', (gameID, seat) =>{
            console.log(`Joined seat: ${seat} gameID: ${gameID}`)
            _socket.join(`game-${gameID}-${seat}`)
        })
        
        _socket.on('join-game', (gameID) =>{
            _socket.join(`game-${gameID}`)
        })

    })
    app.set('io', io)
    return server
}

module.exports = initSockets;