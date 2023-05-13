import { addCardElements } from "./cards.js";
import { addCard } from "./add-cards.js";
import { newPlayer } from "./new-player.js";
import { fold } from "./fold.js";

const cards = document.querySelectorAll(".card");

document.addEventListener("DOMContentLoaded", () => {
  // Handle the cards design
  cards.forEach(addCardElements);

  // Buttons used for testing
  const buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      let argument = button.getAttribute("argument");
      if (argument == 0) newPlayer();
      else {
        const args = argument.split(",");
        if (args.length == 1) {
          fold(args[0].trim());
        } else {
          addCard(args[0].trim(), args[1].trim());
        }
      }
    });
  });
});
