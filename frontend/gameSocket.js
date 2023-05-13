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

// document.getElementById('testButton').addEventListener('click',(event)=>{
//     fetch(`/games/${gameID}/testSocket`,{
//         method:"post",
//         headers:{"Content-Type": "application/json"},
//     })
// })

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
document.querySelector("input#gameChatMessage").addEventListener('keydown',(event)=>{
    if(event.keyCode !== 13){
        return
    }
    const message = event.target.value;
    event.target.value=""
    fetch(`/chat/game/${gameID}`,{
        method:"post",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({message}),
    })
})

socket.on(socketCalls.SYSTEM_MESSAGE_RECEIVED, ({message, timestamp})=>{
    const systemMessageContainer = document.querySelector('#System')

    const entry = document.createElement('div');
        
    const messageSpan = document.createElement('span')
    messageSpan.innerText = message 

    const timeStampSpan = document.createElement('span')
    const date = new Date(timestamp)
    timeStampSpan.innerText= date
    
    entry.append(messageSpan, timeStampSpan)
    systemMessageContainer.insertBefore(entry, systemMessageContainer.firstChild)
})

socket.on(socketCalls.PLAYER_JOINED_RECEIVED, ({username})=>{
    const playersContainer = document.querySelector('#Lobby')
    const lobby = document.createElement('div')
    lobby.setAttribute('id', 'lobby')
    lobby.innerHTML=username
    playersContainer.appendChild(lobby)
})
socket.on(socketCalls.PLAYER_LEFT_RECEIVED, ({username})=>{
    const lobby = document.getElementById('Lobby')
    const children = lobby.childNodes
    children.forEach(child =>{
        if(child.innerHTML === username){
            lobby.removeChild(child)
        }
    })
})

// Lights and Cameras 

// Game starts
socket.on(socketCalls.REFRESH_GAME,({})=>{
    const playersDiv = document.getElementById('Players')
    playersDiv.innerHTML = ''
    const community = document.getElementById('Community')
    community.innerHTML = ''
    const hand = document.getElementById('Hand')
    hand.innerHTML = ''
})
socket.on(socketCalls.ACTION_START_GAME,({})=>{
    const action = document.getElementById('Actions')
    const button = document.createElement('button')
    button.innerHTML = 'Start Game'
    button.addEventListener('click',()=>{
        action.innerHTML=''
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
        c1.setAttribute('id', 'Card')
        c1.innerHTML = cards[0]
        const c2 = document.createElement('div')
        c2.setAttribute('id', 'Card')
        c2.innerHTML = cards[1]
        hand.appendChild(c1)
        hand.appendChild(c2)
    }
})
socket.on(socketCalls.LOAD_PLAYERS, ({players})=>{
    const playersDiv = document.getElementById('Players') 
    players.forEach(p =>{
        const pDiv = document.createElement('div')
        pDiv.setAttribute('id', 'alive')
        pDiv.innerHTML = p
        playersDiv.appendChild(pDiv)
    })
})
socket.on(socketCalls.ACTION_PAY_BIG_BLIND,({callAmount, cards})=>{
    const action = document.getElementById('Actions')

    const raiseDiv = document.createElement('div')

    const minAmount = document.createElement('label')
    minAmount.innerHTML = 'Big Blind, Call: ' + callAmount

    const input = document.createElement('input')
    input.setAttribute('type','number')
    input.setAttribute('name','bet')
    input.setAttribute('min', callAmount)
    input.addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){
            action.innerHTML=''
            
            const hand = document.getElementById('Hand')
            const c1 = document.createElement('div')
            c1.setAttribute('id', 'Card')
            c1.innerHTML=cards[0]
            const c2 = document.createElement('div')
            c2.setAttribute('id','Card')
            c2.innerHTML=cards[1]
            hand.appendChild(c1)
            hand.appendChild(c2)
            
            const bet = event.target.value
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

})

// Player actions
socket.on(socketCalls.PLAYER_FOLDS, ({username})=>{
    const divs = document.querySelectorAll('div#alive')
    divs.forEach(div => {
        let name = div.innerHTML
        if(name === username){
            name = name + ':folded'
        }
        div.innerHTML = name
    })
})
socket.on(socketCalls.ACTION_PLAYERS_TURN,({callAmount, bigBlind})=>{
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


socket.on(socketCalls.GAME_ENDS_SHOW_CARDS, ({remaining})=>{
    console.log("Game ended")
    console.log("Remaining: " + JSON.stringify(remaining))
    const divs = document.querySelectorAll('div#alive')
    divs.forEach(div => {
        let name = div.innerHTML
        for(var key in remaining){
            if(name === key){
                const c1 = document.createElement('div')
                c1.setAttribute('id', 'Card')
                const c2 = document.createElement('div')
                c2.setAttribute('id', 'Card')
                c1.innerHTML = remaining[key][0]
                c2.innerHTML = remaining[key][1]
                div.appendChild(c1)
                div.appendChild(c2)
            }
        }
    })
})

socket.on(socketCalls.GAME_FLOP, ({cards})=>{
    const community = document.getElementById('Community')
    community.innerHTML=''
    
    const c1 = document.createElement('div')
    c1.setAttribute('id', 'Card')
    c1.innerHTML = cards[0]

    const c2 = document.createElement('div')
    c2.setAttribute('id', 'Card')
    c2.innerHTML = cards[1]

    const c3 = document.createElement('div')
    c3.setAttribute('id', 'Card')
    c3.innerHTML = cards[2]
    community.appendChild(c1)
    community.appendChild(c2)
    community.appendChild(c3)
})

socket.on(socketCalls.GAME_TURN_RIVER, ({card})=>{
    const community = document.getElementById('Community')
    const c = document.createElement('div')
    c.setAttribute('id', 'Card')
    c.innerHTML = card
    community.appendChild(c)
})

socket.on(socketCalls.UPDATE_CHIPS, ({chips})=>{
    const c = document.getElementById('Chips')
    c.innerHTML = chips
})

socket.on(socketCalls.UPDATE_POT, ({pot})=>{
    const p = document.getElementById('Pot')
    p.innerHTML = pot
})





