import { addCardElements } from "./cards.js";
import { getCard } from "./get-card.js";

const hand = document.getElementsByClassName("hand");

function addCard(player, cardString) {
  if (
    player !== "community" &&
    hand[player].getElementsByClassName("card").length >= 2
  ) {
    console.log(
      "Player: " + player + " already has the maximum number of cards allowed."
    );
    return;
  } else if (
    player === "community" &&
    hand[0].getElementsByClassName("card").length >= 5
  ) {
    console.log(
      "The community cards already has the maximum number of cards allowed."
    );
    return;
  }

  const newCard = document.createElement("div");
  newCard.classList.add("card");

  let card = getCard(cardString);
  newCard.setAttribute("data-suit", card.pip);
  newCard.setAttribute("data-value", card.number);

  addCardElements(newCard);

  if (player === "community") {
    hand[0].appendChild(newCard);
  } else {
    hand[player].appendChild(newCard);
  }
}

export { addCard };
