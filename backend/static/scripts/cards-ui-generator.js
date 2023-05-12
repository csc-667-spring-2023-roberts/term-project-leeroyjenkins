const hand = document.getElementsByClassName("hand");
const display = document.getElementsByClassName("display");
const cards = document.querySelectorAll(".card");

cards.forEach(addCardElements);

function addCard(count, player) {
  for (let i = 0; i < count; i++) {
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.setAttribute("data-suit", randomPip());
    newCard.setAttribute("data-value", rng());
    addCardElements(newCard);

    if (player === "community") {
      hand[0].appendChild(newCard);
    } else {
      hand[player].appendChild(newCard);
    }
  }
}

function removeCards(count, player) {
  hand[player].remove();
}

function newPlayer() {
  let currentPlayer = hand.length;
  console.log(currentPlayer);
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

function rng() {
  let number = Math.floor(Math.random() * 13) + 1;
  let result = "";
  switch (number) {
    case 1:
      result = "A";
      break;
    case 11:
      result = "J";
      break;
    case 12:
      result = "Q";
      break;
    case 13:
      result = "K";
      break;
    default:
      result = number.toString();
  }

  return result;
}

function randomPip() {
  let number = Math.floor(Math.random() * 4) + 1;
  let result = "";
  switch (number) {
    case 1:
      result = "heart";
      break;
    case 2:
      result = "diamond";
      break;
    case 3:
      result = "spade";
      break;
    default:
      result = "club";
  }

  return result;
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
