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
        messageSpan.innerText = message
        const tableIdSpan = document.createElement('span')
        tableIdSpan.innerText = gameID
        const timeStampSpan = document.createElement('span')
        timeStampSpan.innerText=timestamp
        
        entry.append(tableIdSpan, messageSpan, timeStampSpan)
        systemMessageContainer.appendChild(entry)
    }
})