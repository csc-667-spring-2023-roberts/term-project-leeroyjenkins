console.log("frontend/homeChat.js")

import io from 'socket.io-client';
import socketCalls from '../backend/sockets/constants'

const socket = io();

const joinGameButton = document.querySelectorAll('div#JoinGame')
joinGameButton.forEach(button=>{
    button.addEventListener('click',(event)=>{
        console.log("clicked")
        const url=`/games/${event.target.parentNode.id}`
        fetch(url,{
            method: "post",
            headers:{"Content-Type": "application/json"}
        })
    })
})

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

