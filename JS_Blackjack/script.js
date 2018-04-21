//
// BlackJack Demo App for Teaching Students JS
// by Mindaugas B.
// 

// Card variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
    values = ['Ace', 'King', 'Queen', 'Jack', 
        'Ten', 'Nine', 'Eight', 'Seven', 'Six', 
        'Five', 'Four', 'Three', 'Two'];

// DOM variables
let textArea        = document.getElementById('text-area'),
    newGameButton   = document.getElementById('new-game-button'),
    hitButton       = document.getElementById('hit-button'),
    stayButton      = document.getElementById('stay-button');

// Game variables
let gameStarted = false,
    gameEnded = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

// initially hide the hit and stay buttons
hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function(){
    gameStarted = true;
    gameEnded = false;
    playerWon = false;
    
    newGameButton.style.display = 'none';
    hitButton.style.display     = 'inline';
    stayButton.style.display    = 'inline';
    
    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [ getNextCard(), getNextCard() ];
    playerCards = [ getNextCard(), getNextCard() ];
    showStatus();
});

hitButton.addEventListener('click', function(){
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener('click', function(){
    gameEnded = true;
    checkForEndOfGame();
    showStatus();
});

// Game logic

function showStatus(){
    if(!gameStarted){
        textArea.innerText = 'Welcome to BlackJack';
        return;
    }
    
    let dealerCardString = '';
    for (let i = 0; i < dealerCards.length; i++){
        dealerCardString += getCardString(dealerCards[i]) + '\n';
    }
    
    let playerCardString = '';
    for (let i = 0; i < playerCards.length; i++){
        playerCardString += getCardString(playerCards[i]) + '\n';
    }
    
    updateScores();
    
    textArea.innerText = 
        'Dealer has:\n' + dealerCardString +
        '(score:' + dealerScore + ')\n\n' +
        
        'Player has:\n' + playerCardString + 
        '(score:' + playerScore + ')\n\n';
        
    if (gameEnded){
        if(playerWon){
            textArea.innerText += "YOU WIN!";
        } else {
            textArea.innerHTML += "DEALER WINS";
        }
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
}

function createDeck(){
    let deck = [];
    for(let suitIdx = 0; suitIdx < suits.length; suitIdx++){
        for(let valueIdx = 0; valueIdx <values.length; valueIdx++){
            var card = {
                value: values[valueIdx],
                suit: suits[suitIdx]
            }
            deck.push(card);
        }
    }
    return deck;
}

function shuffleDeck(deck){
    for(let i = 0; i < deck.length; i++){
        let swapIdx = Math.trunc(Math.random() * deck.length);
        let tmp = deck[swapIdx];
        deck[swapIdx] = deck[i];
        deck[i] = tmp;
    }
}

function getNextCard(){
    return deck.shift();
}

function checkForEndOfGame(){
    updateScores();
    
    if(gameEnded){
        //let dealer take more cards
        while(dealerScore < playerScore 
                && playerScore <= 21 
                && dealerScore <= 21){
            dealerCards.push(getNextCard());
            updateScores();
        }
    }
    
    if(playerScore > 21){
        playerWon = false;
        gameEnded = true;
    } else if(dealerScore > 21) {
        playerWon = true;
        gameEnded = true;
    } else if (gameEnded) {
        if(playerScore > dealerScore){
            playerWon = true;
        } else if (playerScore == dealerScore) {
            playerWon = false;
        } else {
            playerWon = false;
        }
    }
}

function getCardString(card){
    return card.value + ' of ' + card.suit;
}

function getCardNumericValue(card){
    switch(card.value){
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default: // catches Queen, Kind, etc.
            return 10;
    }
}

function getScore(cardArray){
    let score = 0;
    let hasAce = false;
    for(let i = 0; i < cardArray.length; i++){
        let card = cardArray[i];
        score += getCardNumericValue(card);
        if(card.value === 'Ace'){
            hasAce = true;
        }
    }
    if(hasAce && (score + 10 <= 21)){
        return score + 10;
    }
    return score;
}

function updateScores(){
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}