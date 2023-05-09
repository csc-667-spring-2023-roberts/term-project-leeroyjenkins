console.log('frontend/gameSocket.js')

import io from 'socket.io-client';
import socketCalls from '../backend/sockets/constants'

const socket = io();
const gameID = window.location.pathname.split('/').pop();
const hiddenForm = document.getElementById('seatValue')
const seat = hiddenForm.elements.seatVal.value
socket.emit('join-seat', gameID, seat)
socket.emit('join-game', gameID)
console.log(`Joined seat: ${seat} gameID: ${gameID}`)

document.getElementById('testButton').addEventListener('click',(event)=>{
    fetch(`/games/${gameID}/testSocket`,{
        method:"post",
        headers:{"Content-Type": "application/json"},
    })
})

// const systemMessageContainer = document.querySelector('#game-system-container')
socket.on(socketCalls.SYSTEM_MESSAGE_RECEIVED, ({message, timestamp})=>{
    console.log("system message recieved *2*")

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
        namesList.splice(index,1)
    }
    playersContainer.innerHTML = namesList.join(', ')
})

// Lights and Cameras 
socket.on(socketCalls.GAME_FLOP, ({cards})=>{
    const community = document.getElementById('Community')
    community.innerHTML = cards
})
socket.on(socketCalls.GAME_TURN_RIVER, ({card})=>{
    const community = document.getElementById('Community')
    community.innerHTML = community.innerHTML + card
})

socket.on(socketCalls.ACTION_PLAYERS_TURN,({callAmount, bigBlind})=>{
    console.log("PLAYER_ACTIONS_RECEIVED **")
    const action = document.getElementById('Actions')

    const raiseForm = document.createElement('form')
    raiseForm.setAttribute('action', `/games/${gameID}/bet`)
    raiseForm.setAttribute('method','POST')

    const minAmount = document.createElement('label')
    minAmount.innerHTML = 'Call: ' + callAmount

    const input = document.createElement('input')
    input.setAttribute('type','number')
    input.setAttribute('name','bet')
    input.setAttribute('min', callAmount)

    const raiseButton = document.createElement('button')
    raiseButton.setAttribute('type', 'submit')
    raiseButton.innerHTML = 'Bet'

    raiseForm.appendChild(minAmount)
    raiseForm.appendChild(input)
    raiseForm.appendChild(raiseButton)

    action.appendChild(raiseForm)

    if(!bigBlind && callAmount > 0){
        const foldButton = document.createElement('button')
        foldButton.innerHTML='Fold'
        foldButton.addEventListener('click', ()=>{
            fetch(`/games/${gameID}/fold`,{
                method:"post",
                headers:{"Content-Type": "application/json"}
            })
        })
        action.appendChild(foldButton)
    }
})

