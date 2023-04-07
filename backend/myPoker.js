const deck = ["2S","3S","4S","5S","6S","7S","8S","9S","TS","JS","QS","KS","AS",
                "2D","3D","4D","5D","6D","7D","8D","9D","TD","JD","QD","KD","AD",
                "2C","3C","4C","5C","6C","7C","8C","9C","TC","JC","QC","KC","AC",
                "2H","3H","4H","5H","6H","7H","8H","9H","TH","JH","QH","KH","AH"]
const cardsInPlay = new Set()

function get_card(){
    var card = deck[Math.floor(Math.random()*deck.length)];
    if(!cardsInPlay.has(card)){
        cardsInPlay.add(card)
        return card;
    }
    return get_card();
}

var playerHands = []
var communityHand = []

function dealToPlayers(numPlayers){
    communityHand = [get_card(),get_card(),get_card(),get_card(),get_card()]
    for(var i=0; i<numPlayers; i++){
        const hand = [get_card(), get_card(), ...communityHand]
        playerHands.push(hand)
    }
}

function cardsToString(){
    retString = ""
    retString += "Community: ("
    for(var i=0; i<5; i++){
        retString += communityHand[i]
        if(i<4){
            retString += ", "
        }
    }
    retString += ")"
    for(var i=0; i<playerHands.length; i++){
        retString += "\nPlayer" + i + " (" 
        for(var j=0; j<7; j++){
            retString += playerHands[i][j]
            if(j<6){
                retString += ", "
            }
        }
        retString += ")"
    }
    return retString
}

function rankHand(hand){
    const VALUES = "23456789TJQKA"
    const STRAIGHTS = [[0,1,2,3,4],[1,2,3,4,5],[2,3,4,5,6],[3,4,5,6,7],
                      [4,5,6,7,8],[5,6,7,8,9],[6,7,8,9,10],[7,8,9,10,11],
                      [8,9,10,11,12],[9,10,11,12,0],[10,11,12,0,1],[11,12,0,1,2],
                      [12,0,1,2,3]]
    const valueCounts = {}
    const suits = {}
    let highCard = null
    let rank = 0
    let handValues = hand.map((card) =>{
        const value = card[0];
        const suit = card[1];
        const valueIndex = VALUES.indexOf(value)
        valueCounts[valueIndex] = (valueCounts[valueIndex] || 0) + 1;
        suits[suit] = (suits[suit] || 0) + 1
        return valueIndex
    }).sort((a,b) => b-a)
    // const isFlush = Object.values(suits).some((count) => count >= 5)
    const isFlush = Object.entries(suits).some(([suit, count])=>{
        if(count >= 5){
            const flushCards = hand.filter(card => card[1] === suit)
            const flushValues = flushCards.map(card => VALUES.indexOf(card[0]))
            flushValues.sort((a,b) => b-a)
            highCard = flushValues[0] * 10 + flushValues[1] * 0.1 + flushValues[2] * 0.001 + flushValues[3] * 0.00001 + flushValues[4] * 0.0000001
            return true
        }
        return false
    })
    
    const isStraight = STRAIGHTS.some(straight => {
        if(straight.every(value => handValues.includes(value))){
            highCard = Math.max(...straight) * 10
            return true
        }
        return false
    })
    const fourOfAKindValue = Object.entries(valueCounts).find(([_, count]) => count === 4)?.[0]
    let threeOfAKindValue
    Object.entries(valueCounts).forEach(([value, count])=>{
        if(count === 3 && (!threeOfAKindValue || value > threeOfAKindValue)){
            threeOfAKindValue = value
        }
    })
    const twoOfAKind = []
    Object.entries(valueCounts).forEach(([value, count])=>{
        if(count === 2){
            twoOfAKind.push(value)
        }
    })
    twoOfAKind.sort((a,b) => b-a);
    

    if(isFlush && isStraight){
        rank += 8000 + highCard
        return {"Hand": "Straight Flush","Rank": rank, "HighCard": highCard}
    }
    if(fourOfAKindValue !== undefined){
        rank += 7000 + parseInt(fourOfAKindValue)
        return {"Hand": "Four pair","Rank": rank, "HighCard": fourOfAKindValue}
    }
    if(threeOfAKindValue !== undefined && twoOfAKind.length > 0){
        rank += 6000 + parseInt(threeOfAKindValue)*20 + parseInt(twoOfAKind)
        return {"Hand": "Full House", "Rank": rank, "Threes": threeOfAKindValue, "Twos": twoOfAKind[0]}
    }
    if(isFlush){
        rank += 5000 + highCard
        return {"Hand": "Flush", "Rank": rank, "HighCard": highCard}
    }
    if(isStraight){
        rank += 4000 + highCard
        return {"Hand": "Straight", "Rank": rank, "HighCard": highCard}
    }
    function findRemaining(val){
        for(let i=0; i<val.length; i++){
            handValues = handValues.filter(num => num !== val[i])
        }
    }

    if(threeOfAKindValue !== undefined){
        findRemaining([parseInt(threeOfAKindValue)])
        rank += 3000 + parseInt(threeOfAKindValue)
        rem = parseFloat(handValues[0]) * 0.01 + parseFloat(handValues[1]) * 0.0001
        rank = parseFloat(rank) + rem
        return {"Hand": "Three pair","Rank": rank, "Threes": threeOfAKindValue, "Remaining": [handValues[0],handValues[1]]}
    }
    if(twoOfAKind.length >= 2){
        findRemaining([parseInt(twoOfAKind[0]),parseInt(twoOfAKind[1])])
        rank += 2000 + parseInt(twoOfAKind[0])*20 + parseInt(twoOfAKind[1])
        rem = parseFloat(handValues[0]) * 0.01
        rank = parseFloat(rank) + rem
        return {"Hand":"Two pair","Rank": rank, "High Pair": twoOfAKind[0],"Low Pair":twoOfAKind[1], "Remaining": handValues[0]}
    }
    if(twoOfAKind.length === 1){
        findRemaining([parseInt(twoOfAKind[0])])
        rank += 1000 + parseInt(twoOfAKind[0])
        rem = parseFloat(handValues[0]) * 0.01 + parseFloat(handValues[1]) * 0.0001 + parseFloat(handValues[2]) * 0.000001
        rank = parseFloat(rank) + rem
        return {"Hand": "Pair", "Rank": rank, "Pair": twoOfAKind[0], "Remaining": [handValues[0],handValues[1],handValues[2]]}
    }
    highCard = Math.max(...handValues)
    return {"Hand": "High Card", "Rank": highCard, "HighCard": highCard}
}

function findWinningHand(playerHands){
    let maxRank = 0
    const handRanks = playerHands.map((element, index) => {
        const handDeets = rankHand(element)
        // console.log(handDeets)
        if(handDeets["Rank"] >= maxRank){
            maxRank = handDeets["Rank"]
        }
        return handDeets
    })
    const winnerIs = []
    const winners = handRanks.filter((element, index) =>{
        if(element["Rank"] === maxRank){
            winnerIs.push(index)
            return true;
        }
        return false
    })
    return Object.assign({},{"Winner(s)": winnerIs}, winners)
    // return winners
}
dealToPlayers(4)
console.log(cardsToString())
console.log("Results: \n", findWinningHand(playerHands))


// const test1 = [["AH","JH","7D","KH","QH","4S","TH"], //Royal Flush
//               ["AH","TH","AC","KD","AS","AD","3D"], //4 Kind
//               ["QD","JS","QS","AH","QC","AS","4H"], //Full House
//               ["2D","8D","6D","4D","TC","AC","QD"], //Flush
//               ["4D","7C","3H","5S","6S","KC","AS"], //Straight
//               ["AH","AS","KD","3C","AC","6S","2H"], //3 Kind
//               ["AH","AD","3D","3S","KS","KD","5C"], //2 Kind (3 pair)
//               ["AH","3C","5D","AS","QC","8S","2C"], //2 Kind
//               ["2D","8H","6D","4H","TC","AC","QD"]]; //Ace high 
// console.log(findWinningHand(test1))

// const test2 = ["AH","AS","3C","4D","8D","TC","TS"]
// console.log(rankHand(test2))

// const FlushTest = ["AD","KD","TD","9D","TC","AC","3D"]
// console.log(rankHand(FlushTest))