import io from "socket.io-client";

const socket = io();

let messageContainer;

document.addEventListener("DOMContentLoaded", function () {
  messageContainer = document.querySelector("#lobby-messages");
  const input = document.querySelector("#lobby-chat-input");
  if(input){
    input.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        const message = event.target.value;
        event.target.value = "";
  
        fetch("/lobby-chat", {
          method: "post",
          body: JSON.stringify({ message }),
          headers: { "Content-Type": "application/json" },
        });
      }
    });
  }
});

socket.on("lobby-chat-message", ({ message, sender }) => {
  console.log({ message, sender });

  const display = document.createElement("div");
  display.innerText = sender + ": " + message;
  display.classList.add("lobby-message");

  messageContainer.append(display);

  messageContainer.lastChild.scrollIntoView();
});