const hand = document.getElementsByClassName("hand");

function fold(player) {
  if (player === "community") player = 0;
  let length = hand[player].getElementsByClassName("card").length;

  for (let i = 0; i < length; i++) {
    hand[player].getElementsByClassName("card")[0].remove();
  }
}

export { fold };
