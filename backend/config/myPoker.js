class cardsInPlay{
    deck = ["2S","3S","4S","5S","6S","7S","8S","9S","TS","JS","QS","KS","AS",
                "2D","3D","4D","5D","6D","7D","8D","9D","TD","JD","QD","KD","AD",
                "2C","3C","4C","5C","6C","7C","8C","9C","TC","JC","QC","KC","AC",
                "2H","3H","4H","5H","6H","7H","8H","9H","TH","JH","QH","KH","AH"]
    communityHand;
    numPlayers;
    hands;
    playerHands_full;
    allCards;
    winner;
    ranks;
    
    constructor(numPlayers){
        this.numPlayers = numPlayers
        this.allCards = new Set()
        this.playerHands_full = []
        this.communityHand = [this.get_card(),this.get_card(),this.get_card(),this.get_card(),this.get_card()]
        for(var i=0; i<numPlayers; i++){
            const hand = [this.get_card(), this.get_card(), ...this.communityHand]
            this.playerHands_full.push(hand)
        }
        this.ranks = this.playerHands_full.map((element)=>{
            const handDeets = this.rankHand(element)
            return handDeets["Rank"]
        })
    }
    getCommunity(){
        return this.communityHand;
    }
    getPlayerCards(){
        const hands = this.playerHands_full.map((element)=>{
            return [element[0],element[1]]
        })
        return hands;
    }
    getRanks(){
        return this.ranks;
    }

    //helper functions
    get_card(){
        var card = this.deck[Math.floor(Math.random()*this.deck.length)];
        if(!this.allCards.has(card)){
            this.allCards.add(card)
            return card;
        }
        return this.get_card();
    }
    rankHand(hand){
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
            const rem = parseFloat(handValues[0]) * 0.01 + parseFloat(handValues[1]) * 0.0001
            rank = parseFloat(rank) + rem
            return {"Hand": "Three pair","Rank": rank, "Threes": threeOfAKindValue, "Remaining": [handValues[0],handValues[1]]}
        }
        if(twoOfAKind.length >= 2){
            findRemaining([parseInt(twoOfAKind[0]),parseInt(twoOfAKind[1])])
            rank += 2000 + parseInt(twoOfAKind[0])*20 + parseInt(twoOfAKind[1])
            const rem = parseFloat(handValues[0]) * 0.01
            rank = parseFloat(rank) + rem
            return {"Hand":"Two pair","Rank": rank, "High Pair": twoOfAKind[0],"Low Pair":twoOfAKind[1], "Remaining": handValues[0]}
        }
        if(twoOfAKind.length === 1){
            findRemaining([parseInt(twoOfAKind[0])])
            rank += 1000 + parseInt(twoOfAKind[0])
            const rem = parseFloat(handValues[0]) * 0.01 + parseFloat(handValues[1]) * 0.0001 + parseFloat(handValues[2]) * 0.000001
            rank = parseFloat(rank) + rem
            return {"Hand": "Pair", "Rank": rank, "Pair": twoOfAKind[0], "Remaining": [handValues[0],handValues[1],handValues[2]]}
        }
        highCard = Math.max(...handValues)
        return {"Hand": "High Card", "Rank": highCard, "HighCard": highCard}
    }
}

module.exports = {
    cardsInPlay
}

