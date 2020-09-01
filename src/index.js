import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button 
            className="square" 
            onClick={props.onClick}
        >
          {props.value}
        </button>
      );
  }
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    
    render() {
        return (
            <div>
                <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                </div>
                <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                </div>
                <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
  
function Game(props) {
    const [history, setHistory] = useState( {history: { 
                                                squares: [Array(9).fill(null)] 
                                            }});
    const [xIsNext, setXIsNext] = useState(true);
    const [stepNumber, setStepNumber] = useState(0);

    const updateHistory = (squares) => {
        const temp = history.slice(0, stepNumber+1);
        temp.concat([{
            squares: squares
        }])
        setHistory(temp);
    } 

    function handleClick(i) {
        const revertHistory = history.slice(0, stepNumber+1);
        const current = revertHistory[revertHistory.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? 'X' : 'O';
        updateHistory(squares);
        setStepNumber(history.length);
        setXIsNext(!xIsNext);
    }
    
    const jumpTo = (step) => {
        setStepNumber(step) 
        setXIsNext((step % 2)==0)
    };

    // Renders Buttons
    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        )
    });
    
    const current = history[stepNumber];

    // Check if game state!
    const getStatus = () => {
        const winner = calculateWinner(current.squares);
        
        let status;
        if (winner==='tied') {
            return 'Game ' + winner;
        } else if (winner) {
            return 'Winner: ' + winner;
        } else {
            return 'Next Player: ' + (xIsNext)
        }
    };

    return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{ getStatus }</div>
            <ol>{ moves }</ol>
            </div>
        </div>
    );
}
  
function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    var numFull = 0;
    for (let i = 0; i< lines.length; i++){
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a]===squares[b] && squares[a]===squares[c]) {
            return squares[a];
        }    
    }

    for (let i=0; i<9; i++) {
        numFull += (squares[i]!=null ? 1 : 0);
    }
    if (numFull===9) {
        return 'tied';
    }
    return null;
}

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  