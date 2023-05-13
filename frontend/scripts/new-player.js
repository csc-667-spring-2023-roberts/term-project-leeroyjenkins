const hand = document.getElementsByClassName("hand");
const display = document.getElementsByClassName("display");

function newPlayer() {
  if (hand.length > 6) {
    console.log("This room is already at max capacity.");
    return;
  }

  let currentPlayer = hand.length;
  const newPlayer = document.createElement("div");
  newPlayer.classList.add("player_" + currentPlayer.toString());

  newHand(newPlayer);
  display[0].append(newPlayer);
}

function newHand(parent) {
  const newHand = document.createElement("div");
  newHand.classList.add("hand");
  parent.appendChild(newHand);
}

export { newPlayer, newHand };
