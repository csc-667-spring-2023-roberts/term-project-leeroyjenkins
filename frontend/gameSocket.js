console.log('frontend/gameSocket.js')

import io from 'socket.io-client';
import socketCalls from '../backend/sockets/constants'

const socket = io();

// const systemMessageContainer = document.querySelector('#game-system-container')
socket.on(socketCalls.SYSTEM_MESSAGE_RECEIVED, ({message, gameID, timestamp})=>{
    const qSelector = `#${gameID}-System`
    const systemMessageContainer = document.querySelector(qSelector)

    if(systemMessageContainer !== null){
        const entry = document.createElement('div');
        
        const messageSpan = document.createElement('span')
        messageSpan.innerText = "System: " + message + " time: "
        const timeStampSpan = document.createElement('span')
        timeStampSpan.innerText=timestamp
        
        entry.append(tableIdSpan, messageSpan, timeStampSpan)
        systemMessageContainer.appendChild(entry)
    }
})

socket.on(socketCalls.PLAYER_JOINED_RECEIVED, ({gameID, username})=>{
    const qSelector = `#${gameID}-Players`
    const playersContainer = document.querySelector(qSelector)
    if(playersContainer !== null){
        const entry = document.createElement('div')
        const playerSpan = document.createElement('span')
        playerSpan.innerText = username
        entry.append(playerSpan)
        playersContainer.appendChild(entry)
    }
})
socket.on(socketCalls.PLAYER_LEFT_RECEIVED, ({gameID, username})=>{
    const qSelector = `#${gameID}-Players`
    const playersContainer = document.querySelector(qSelector)
    if(playersContainer !== null){
        const children = playersContainer.children
        for(let i=0; i<children.length; i++){
            console.log(children[i].innerHTML)
            if(children[i].innerHTML == username){
                playersContainer.removeChild(children[i])
            }
        }
    }
})

// Lights and Cameras 
socket.on(socketCalls.ACTION_START_GAME, ({gameID, seat})=>{
    const qSelector = `#${seat}-#${gameID}-Actions`
    const actionsContainer = document.querySelector(qSelector)
    if(actionsContainer !== null){
        const form = document.createElement('form');
        form.setAttribute('action', `/games/${gameID}/create`)
        form.setAttribute('method', 'post')

        
    }
})