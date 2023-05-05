console.log('frontend/gameSocket.js')

import io from 'socket.io-client';
import socketCalls from '../backend/sockets/constants'

const socket = io();
const gameID = window.location.pathname.split('/').pop();
console.log(gameID)
socket.emit('join-game', gameID)

// const systemMessageContainer = document.querySelector('#game-system-container')
socket.on(socketCalls.SYSTEM_MESSAGE_RECEIVED, ({message, timestamp})=>{
    console.log("socketCalls.SYSTEM_MESSAGE_RECEIVED")

    const systemMessageContainer = document.querySelector('#System')

    const entry = document.createElement('div');
        
    const messageSpan = document.createElement('span')
    messageSpan.innerText = "System: " + message + " time: "

    const timeStampSpan = document.createElement('span')
    timeStampSpan.innerText=timestamp
    
    entry.append(messageSpan, timeStampSpan)
    systemMessageContainer.appendChild(entry)
})

socket.on(socketCalls.PLAYER_JOINED_RECEIVED, ({username})=>{
    console.log("socketCalls.PLAYER_JOINED_RECEIVED")
    const playersContainer = document.querySelector('#Lobby')
    playersContainer.innerHTML = playersContainer.innerHTML + ', ' + username
})
socket.on(socketCalls.PLAYER_LEFT_RECEIVED, ({username})=>{
    console.log("socketCalls.PLAYER_LEFT_RECEIVED")
    const playersContainer = document.querySelector('#Lobby')
    const names = playersContainer.innerHTML
    const namesList = names.split(', ')
    const index = namesList.indexOf(username)
    if(index !== -1){
        namesList.splict(index,1)
    }
    playersContainer.innerHTML = namesList.join(', ')
})

// Lights and Cameras 
