const cardsOnPage = document.querySelectorAll('div#Card')
cardsOnPage.forEach(card=>{
    const c = addCard(card.innerHTML)
    card.innerHTML=''
    card.appendChild(c)
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
        number = cardString.charAt(0);
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
  