import './pokerTableUI.css';


function PokerTableUI() {
    console.log("in poker Table UI");
    return (
        <div className="page-container">
            <div className="game-area">
                <div className='player-card'>
                    <p>Player 1</p>
                </div>
                <div className='player-card'>
                    <p>Player 2</p>
                </div>
                <div className='player-card'>
                    <p>Player 3</p>
                </div>
                <div className='player-card'>
                    <p>Player 4</p>
                </div>
                <div className='player-card'>
                    <p>Player 5</p>
                </div>
                <div className='player-card'>
                    <p>Player 6</p>
                </div>
            </div>
            <div className="chat-area">
                <h1>Chat Area</h1>
            </div>
        </div>
    )
};

export default PokerTableUI;