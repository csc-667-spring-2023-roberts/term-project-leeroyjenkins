import './pokerTableUI.css';

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

function PokerTableUI() {
  return (
    <>
      <div className='page-container'>
        <div className='game-area'>
          <div className='top-players'>
            <div className='player-card'>
              <p>player 1</p>
            </div>
            <div className='player-card'>
              <p>player 2</p>
            </div>
            <div className='player-card'>
              <p>player 3</p>
            </div>
          </div>
          <div className='community-board'>
            <p></p>
          </div>
          <div className='bottom-players'>
            <div className='player-card'>
              <p>player 4</p>
            </div>
            <div className='player-card owner-cards'>
              <p>player 5</p>
            </div>
            <div className='player-card'>
              <p>player 6</p>
            </div>
          </div>
          <div className='player-options'>
            <button>Check</button>
            <button>Bet</button>
            <button>Fold</button>
            <div class="slidecontainer">
              <input type="range" min="1" max="100" value="50" class="slider" id="myRange" />
            </div>
          </div>
        </div>
        <div className='chat-area'>
          <h1>Chat Area</h1>
          <div className = 'text-box'>
            <p>Text Box</p>
          </div>
        </div>
      </div>
    </>
  )
};


export default PokerTableUI;