console.log("frontend/index.js")

import io from 'socket.io-client';

const socket = io();

const messageContainer= document.querySelector('#messages')

socket.on('chat-message-recieved', ({username, message, timestamp}) =>{
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
    fetch('/chat/0',{
        method:"post",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({message: event.target.value}),
    })
})

