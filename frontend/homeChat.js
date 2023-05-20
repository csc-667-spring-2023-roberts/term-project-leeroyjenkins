console.log("frontend/homeChat.js")

import io from 'socket.io-client';
import socketCalls from '../backend/sockets/constants'

const socket = io();

let messageContainer

document.addEventListener("DOMContentLoaded", function () {
    messageContainer = document.querySelector("#lobby-messages");
    const input = document.querySelector("#lobby-chat-input");
    if(input){
      input.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
          const message = event.target.value;
          event.target.value = "";
    
          fetch('/chat/',{
            method:"post",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({message}),
        })
        }
      });
    }
  });

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


socket.on(socketCalls.CHAT_MESSAGE_RECEIVED, ({username, message, timestamp}) =>{
    const entry = document.createElement('div');
    entry.setAttribute('class', 'lobby-message')

    const displayName = document.createElement('span')
    displayName.innerText = username + ":"
    const displayMessage = document.createElement('span')
    displayMessage.innerText = message
    const displayTimestamp = document.createElement('span')
    displayTimestamp.innerText = " " + new Date(timestamp).toLocaleString()
    displayTimestamp.style.fontSize = "9pt";

    entry.append(displayName,displayMessage,displayTimestamp)
    messageContainer.appendChild(entry)
    messageContainer.lastChild.scrollIntoView();
})


socket.on(socketCalls.TABLE_UPDATE,({tableID, min, max, tname, plimit, count})=>{
  const row = document.createElement('tr')
  row.setAttribute('id', `${tableID}`)

  const tdMin = document.createElement('td')
  tdMin.innerHTML = min
  
  const tdMax = document.createElement('td')
  tdMax.innerHTML = max
  
  const tdName = document.createElement('td')
  tdName.innerHTML = tname
  
  const tdLimit = document.createElement('td')
  tdLimit.innerHTML = plimit
  
  const tdCount = document.createElement('td')
  tdCount.innerHTML = count
  
  const tdForm = document.createElement('td')
  const form = document.createElement('form')
  form.setAttribute('action', `/games/${tableID}`)
  form.setAttribute('method', 'post')
  const button = document.createElement('button')
  button.setAttribute('type','submit')
  button.innerHTML="Join"
  form.appendChild(button)
  tdForm.appendChild(form)

  row.appendChild(tdName)
  row.appendChild(tdMin)
  row.appendChild(tdMax)
  row.appendChild(tdCount)
  row.appendChild(tdLimit)
  row.appendChild(tdForm)
  
  const toAdd = document.getElementById('GameTableBody')
  toAdd.appendChild(row)
})