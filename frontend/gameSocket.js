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

const cardsOnPage = document.querySelectorAll('div#Card')
cardsOnPage.forEach(card=>{
    const c = addCard(card.innerHTML)
    card.innerHTML=''
    card.appendChild(c)
})

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

document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector("#gameChatMessage");
    if(input){
      input.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            const message = event.target.value;
            event.target.value=""
            fetch(`/chat/game/${gameID}`,{
                method:"post",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({message}),
            })
        }
      });
    }
});

socket.on(socketCalls.SYSTEM_MESSAGE_RECEIVED, ({ message, timestamp }) => {
  const systemMessageContainer = document.querySelector("#System");
  appendMessage(systemMessageContainer, message, timestamp);
});

socket.on(socketCalls.CHAT_MESSAGE_RECEIVED, ({ message, timestamp }) => {
  const systemMessageContainer = document.querySelector("#chat-log");
  appendMessage(systemMessageContainer, message, timestamp);
});

function appendMessage(messageContainer, message, timestamp) {
  const entry = document.createElement("div");

  const messageSpan = document.createElement("span");
  messageSpan.classList.add("message");
  messageSpan.innerText = message;

  const timeStampSpan = document.createElement("span");
  timeStampSpan.classList.add("timestamp");
  const date = " " + new Date(timestamp).toLocaleString();
  timeStampSpan.innerText = date;

  entry.append(messageSpan, timeStampSpan);
  entry.setAttribute("class", "game-message");

  messageContainer.appendChild(entry);
  messageContainer.lastChild.scrollIntoView();
}

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
    button.setAttribute('id', 'startGame')
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
        // const c1 = document.createElement('div')
        // c1.setAttribute('id', 'Card')
        // c1.innerHTML = cards[0]
        // const c2 = document.createElement('div')
        // c2.setAttribute('id', 'Card')
        // c2.innerHTML = cards[1]

        const c1 = addCard(cards[0])
        const c2 = addCard(cards[1])
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
    minAmount.innerHTML = 'Big Blind, Call: $' + callAmount
    minAmount.setAttribute('class','bet-label')

    const input = document.createElement('input')
    input.setAttribute('type','number')
    input.setAttribute('name','bet')
    input.setAttribute('min', callAmount)
    input.setAttribute('id','betInput')
    input.setAttribute('placeholder','Bet amount')
    input.addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){
            action.innerHTML=''
            
            const hand = document.getElementById('Hand')
            // const c1 = document.createElement('div')
            // c1.setAttribute('id', 'Card')
            // c1.innerHTML=cards[0]
            // const c2 = document.createElement('div')
            // c2.setAttribute('id','Card')
            // c2.innerHTML=cards[1]
            const c1 = addCard(cards[0])
            const c2 = addCard(cards[1])
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
        minAmount.innerHTML = 'Big Blind, Call: $' + callAmount
        minAmount.setAttribute('class','bet-label')
    }else{
        minAmount.innerHTML = 'Call: $' + callAmount
        minAmount.setAttribute('class','bet-label')
    }

    const input = document.createElement('input')
    input.setAttribute('type','number')
    input.setAttribute('name','bet')
    input.setAttribute('min', callAmount)
    input.setAttribute('id','betInput')
    input.setAttribute('placeholder','Bet amount')
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
        foldButton.setAttribute('id','foldButton')
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
                const handDiv = document.createElement('div')
                handDiv.setAttribute('id','Hand')
                const c1 = addCard(remaining[key][0])
                const c2 = addCard(remaining[key][1])
                handDiv.appendChild(c1)
                handDiv.appendChild(c2)
                div.appendChild(handDiv)
            }
        }
    })
})

socket.on(socketCalls.GAME_FLOP, ({cards})=>{
    const community = document.getElementById('Community')
    community.innerHTML=''
    
    // const c1 = document.createElement('div')
    // c1.setAttribute('id', 'Card')
    // c1.innerHTML = cards[0]

    // const c2 = document.createElement('div')
    // c2.setAttribute('id', 'Card')
    // c2.innerHTML = cards[1]

    // const c3 = document.createElement('div')
    // c3.setAttribute('id', 'Card')
    // c3.innerHTML = cards[2]
    const c1 = addCard(cards[0])
    const c2 = addCard(cards[1])
    const c3 = addCard(cards[2])
    community.appendChild(c1)
    community.appendChild(c2)
    community.appendChild(c3)
})

socket.on(socketCalls.GAME_TURN_RIVER, ({card})=>{
    const community = document.getElementById('Community')
    // const c = document.createElement('div')
    // c.setAttribute('id', 'Card')
    // c.innerHTML = card
    const c = addCard(card)
    community.appendChild(c)
})

socket.on(socketCalls.UPDATE_CHIPS, ({chips, cash})=>{
    console.log("updating cash: " + cash)
    const pToChange = document.getElementById('Wallet')
    pToChange.innerHTML =  cash
    const c = document.getElementById('Chips')
    c.innerHTML = chips
})

socket.on(socketCalls.UPDATE_POT, ({pot})=>{
    const p = document.getElementById('Pot')
    p.innerHTML = pot
})

socket.on(socketCalls.GAME_UPDATE_PLAYER_CASH,({cash})=>{
    console.log("updating cash: " + cash)
    const pToChange = document.getElementById('Wallet')
    pToChange.innerHTML = cash
})




function addCard(cardString){
    console.log("cardString: " + cardString)
    const newCard = document.createElement("div");
    newCard.classList.add("card");

    newCard.setAttribute('id', 'Card')

    let card = getCard(cardString);
    newCard.setAttribute("data-suit", card.pip);
    newCard.setAttribute("data-value", card.number);

    addCardElements(newCard);
    return newCard;
}

function addCardElements(card) {
  const value = card.dataset.value;

  const valueAsNumber = parseInt(value);
  if (isNaN(valueAsNumber)) {
    if (value === "A") card.append(createPip());
    else {
      card.append(createPip());
    }
  } else {
    for (let i = 0; i < valueAsNumber; i++) card.append(createPip());
  }

  if (value !== "unknown") {
    card.append(createCornerNumber("top", value));
    card.append(createCornerNumber("bottom", value));
  }
}

function createCornerNumber(position, value) {
  const corner = document.createElement("div");
  corner.textContent = value;
  corner.classList.add("corner-number");
  corner.classList.add(position);
  return corner;
}

function createPip() {
  const pip = document.createElement("div");
  pip.classList.add("pip");
  return pip;
}

function getCard(cardString) {
  let number = "";
  let pip = "";
  if (cardString === "unknown") {
    number = cardString;
    pip = cardString;
  } else {
    if (cardString.charAt(0) === "T") number = "10";
    else number = cardString.charAt(0);
    pip = getPip(cardString.charAt(1));
  }

  var card = {
    number: number,
    pip: pip,
  };

  return card;
}

function getPip(pip) {
  let result = "";
  switch (pip) {
    case "D":
      result = "diamond";
      break;
    case "H":
      result = "heart";
      break;
    case "S":
      result = "spade";
      break;
    case "C":
      result = "club";
      break;
    default:
      result = "unknown";
  }

  return result;
}