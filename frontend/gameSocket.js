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

const smallBlindButton = document.getElementById('startGame')
if(smallBlindButton){
    smallBlindButton.addEventListener('click',()=>{
        const actions = document.getElementById('Actions')
        actions.innerHTML=''
        fetch(`/games/${gameID}/create`,{
            method:"post",
            headers:{"Content-Type": "application/json"},
        })
    })
}
const betInput = document.getElementById('betInput')
if(betInput){
    betInput.addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){
            const action = document.getElementById('Actions')
            const bet = event.target.value
            action.innerHTML=''
            console.log('bet amount:' + bet)
            fetch(`/games/${gameID}/bet`,{
                method:"post",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({bet})
            })
        }
    })
}
const foldButton = document.getElementById('foldButton')
if(foldButton){
    foldButton.addEventListener('click', ()=>{
        const action = document.getElementById('Actions')
        action.innerHTML=''
        fetch(`/games/${gameID}/fold`,{
            method:"post",
            headers:{"Content-Type": "application/json"}
        })
    })
}

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
socket.on(socketCalls.ACTION_START_GAME,({})=>{
    const action = document.getElementById('Actions')
    const button = document.createElement('button')
    button.innerHTML = 'Pay Small Blind'
    button.addEventListener('click',()=>{
        fetch(`/games/${gameID}/create`,{
            method:"post",
            headers:{"Content-Type": "application/json"},
        })
    })
    action.appendChild(button)
})

socket.on(socketCalls.GAME_DEAL_CARDS, ({cards})=>{
    const hand = document.getElementById('Hand')
    if(hand.hasChildNodes()){
        console.log('cards dealt already')
    }else{
        const c1 = document.createElement('div')
        c1.innerHTML = cards[0]
        const c2 = document.createElement('div')
        c2.innerHTML = cards[1]
        hand.appendChild(c1)
        hand.appendChild(c2)
    }
})

socket.on(socketCalls.GAME_FLOP, ({cards})=>{
    const community = document.getElementById('Community')
    
    const c1 = document.createElement('div')
    c1.innerHTML = cards[0]

    const c2 = document.createElement('div')
    c2.innerHTML = cards[1]

    const c3 = document.createElement('div')
    c3.innerHTML = cards[2]
    community.appendChild(c1)
    community.appendChild(c2)
    community.appendChild(c3)
})
socket.on(socketCalls.GAME_TURN_RIVER, ({card})=>{
    const community = document.getElementById('Community')
    const c = document.createElement('div')
    c.innerHTML = card
    community.appendChild(c)
})

socket.on(socketCalls.ACTION_PLAYERS_TURN,({callAmount, bigBlind})=>{
    console.log("PLAYER_ACTIONS_RECEIVED **")
    const action = document.getElementById('Actions')

    const raiseDiv = document.createElement('div')

    const minAmount = document.createElement('label')
    if(bigBlind){
        minAmount.innerHTML = 'Big Blind, Call: ' + callAmount
    }else{
        minAmount.innerHTML = 'Call: ' + callAmount
    }

    const input = document.createElement('input')
    input.setAttribute('type','number')
    input.setAttribute('name','bet')
    input.setAttribute('min', callAmount)
    input.addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){
            const bet = event.target.value
            action.innerHTML=''
            console.log('bet amount:' + bet)
            fetch(`/games/${gameID}/bet`,{
                method:"post",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({bet})
            })
        }
    })

    raiseDiv.appendChild(minAmount)
    raiseDiv.appendChild(input)

    action.appendChild(raiseDiv)

    if(!bigBlind && callAmount > 0){
        const foldButton = document.createElement('button')
        foldButton.innerHTML='Fold'
        foldButton.addEventListener('click', ()=>{
            action.innerHTML=''
            fetch(`/games/${gameID}/fold`,{
                method:"post",
                headers:{"Content-Type": "application/json"}
            })
        })
        action.appendChild(foldButton)
    }
})

