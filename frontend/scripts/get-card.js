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

export { getCard, getPip };
