console.log("frontend/index.js")

import io from 'socket.io-client';
import socketCalls from '../backend/sockets/constants'

const socket = io();

const messageContainer= document.querySelector('#messages')

socket.on(socketCalls.CHAT_MESSAGE_RECEIVED, ({username, message, timestamp}) =>{
    const entry = document.createElement('div');

    const displayName = document.createElement('span')
    displayName.innerText = username
    const displayMessage = document.createElement('span')
    displayMessage.innerText = message
    const displayTimestamp = document.createElement('span')
    displayTimestamp.innerText = timestamp

    entry.append(displayName,displayMessage,displayTimestamp)
    messageContainer.appendChild(entry)
    // console.log("*cmr* username: " + username + ", message: " + message)
})

document.querySelector("input#chatMessage").addEventListener('keydown',(event)=>{
    if(event.keyCode !== 13){
        return
    }
    // console.log('Sending', event.target.value)
    const message = event.target.value;
    event.target.value = ""

    fetch('/chat/0',{
        method:"post",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({message}),
    })
})

const systemMessageContainer = document.querySelector('#game-system-container')
socket.on(socketCalls.SYSTEM_MESSAGE_RECEIVED, ({message, table_id, timestamp})=>{
    const entry = document.createElement('div');
    
    const messageSpan = document.createElement('span')
    messageSpan.innerText = message
    const tableIdSpan = document.createElement('span')
    tableIdSpan.innerText = table_id
    const timeStampSpan = document.createElement('span')
    timeStampSpan.innerText=timestamp

    entry.append(tableIdSpan, messageSpan, timeStampSpan)
    systemMessageContainer.appendChild(entry)
})