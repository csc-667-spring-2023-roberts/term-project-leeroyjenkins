const display = document.getElementsByClassName("hand");
const cards = document.querySelectorAll(".card");

cards.forEach(addCardElements);

function addcards(count) {
  const newHand = document.createElement("div");
  newHand.classList.add("card");
  newHand.setAttribute("data-suit", randomPip());
  newHand.setAttribute("data-value", rng());
  addCardElements(newHand);
  display[0].appendChild(newHand);
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
  console.log(number);
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
