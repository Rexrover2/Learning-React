import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = props => {
    return (
      <button
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
};
  
const Board = props => {    
    const renderSquare = i => {
      return (
        <Square
          value={props.squares[i]}
          onClick={() => props.onClick(i)}
        />
      );
    };
  
    return (
      <div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
    );
};
  
const Game = (props) => {
    const initialHistory = [
            { squares: Array(9).fill(null) }
        ]
    const [history, setHistory] = useState(initialHistory);
    const [xIsNext, setXIsNext] = useState(true);
    const [stepNumber, setStepNumber] = useState(0);

    const handleClick = (i) => {
        const slicedHistory = history.slice(0, stepNumber+1);
        const current = slicedHistory[slicedHistory.length - 1];
        const newSquares = current.squares.slice();

        // Nothing happens if square is already filled and there is no winner.
        if (calculateWinner(newSquares) || newSquares[i]) {
            return;
        }

        newSquares[i] = xIsNext ? 'X' : 'O';
        setHistory([...slicedHistory, {squares: newSquares}]);
        setStepNumber(slicedHistory.length);
        setXIsNext(!xIsNext);
    }
    
    const jumpTo = (step) => {
        setStepNumber(step) 
        setXIsNext((step % 2)===0)
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
    
    const currentStep = history[stepNumber];
    const winner = calculateWinner(currentStep.squares);

    // How to have a conditional instead of the ternary operator below??
    const getStatus = () => {
        const winner = calculateWinner(currentStep.squares);

        if (winner==='tied') {
            return 'Game' + winner;
        } else if (winner) {
            return 'Winner: ' + winner;
        } else {
            return 'Next Player: ' + (xIsNext);
        }
    };

    /* const getStatus = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`; */

    return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={currentStep.squares}
                onClick={i => handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div> {getStatus()} </div>
            <ol>{ moves }</ol>
            </div>
        </div>
    );
}
  
const calculateWinner = (squares) => {
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
    
    for (let line of lines){
        const [a,b,c] = line;
        if (squares[a] && squares[a]===squares[b] && squares[a]===squares[c]) {
            return squares[a];
        }    
    }
    var numFull = 0;
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
  