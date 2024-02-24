import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button} from 'react-native';

export default function App() {
  const [Board, setBoard] = useState([]);
  const [playerState, setPlayerState] = useState([]);
  const [aiState, setAiState] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [randomButtonDisabled, setRandomButtonDisabled] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true); // Player's turn initially

  useEffect(() => {
    if (!gameStarted) {
      setupGame();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted && !playerTurn) {
      playAI();
    }
  }, [gameStarted, playerTurn]);

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const canPlaceShip = (board, shipLength, row, col, direction) => {
    if (direction === "horizontal") {
      for (let i = 0; i < shipLength; i++) {
        if (col + i >= 10 || board[row][col + i] !== 0) {
          return false; 
        }
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        if (row + i >= 10 || board[row + i][col] !== 0) {
          return false;
        }
      }
    }
    return true;
  };

  const placeShipsRandomly = (board, shipLength) => {
    const directions = ["horizontal", "vertical"];
    let placed = false;

    while (!placed) {
      const row = getRandomNumber(0, 9);
      const col = getRandomNumber(0, 9);
      const direction = directions[getRandomNumber(0, 1)];

      if (canPlaceShip(board, shipLength, row, col, direction)) {
        if (direction === "horizontal") {
          for (let i = 0; i < shipLength; i++) {
            board[row][col + i] = 1; // Ship marker
          }
        } else {
          for (let i = 0; i < shipLength; i++) {
            board[row + i][col] = 1; // Ship marker
          }
        }
        placed = true;
      }
    }
  };

  const initializeBoard = () => {
    const board = [];
    for (let i = 0; i < 10; i++) {
      board.push(Array(10).fill(0));
    }
    return board;
  };

  const setupGame = () => {
    const pBoard = initializeBoard();
    const aBoard = initializeBoard();
    const shipLengths = [5, 4, 3, 3, 2];
    shipLengths.forEach(length => {
      placeShipsRandomly(pBoard, length);
      placeShipsRandomly(aBoard, length);
    });

    setPlayerState(pBoard);
    setAiState(aBoard);

    setBoard(pBoard);

    setGameOver(false);
  };

  const handleCellPress = async (row, col) => {
    if (gameOver || !playerTurn || aiState[row][col] === 'X' || aiState[row][col] === 'O') {
      return;
    }

    const newBoard = [...aiState];
    if (newBoard[row][col] === 1) {
      newBoard[row][col] = 'X'; // Hit
    } else {
      newBoard[row][col] = 'O'; // Miss
    }
    setAiState(newBoard);
    setBoard(aiState);

    const isGameOver = newBoard.every(row => row.every(cell => cell !== 1));
    setGameOver(isGameOver);

    await new Promise(r => setTimeout(r, 1000));

    setPlayerTurn(false); // AI's turn after player's move
  };

  const playAI = async () => {
    // AI's move logic - choosing random cell
    const row = getRandomNumber(0, 9);
    const col = getRandomNumber(0, 9);

    if (playerState[row][col] === 1) {
      playerState[row][col] = 'X'; // Hit
    } else {
      playerState[row][col] = 'O'; // Miss
    }

    const newBoard = [...playerState];
    setPlayerState(newBoard);
    setBoard(playerState);

    await new Promise(r => setTimeout(r, 2000));

    const isGameOver = newBoard.every(row => row.every(cell => cell !== 1));
    setGameOver(isGameOver);

    await new Promise(r => setTimeout(r, 1000)); // Delay the AI's move
    setBoard(aiState)

    setPlayerTurn(true); // Player's turn after AI's move
  };

  const handleRandomizePress = () => {
    setupGame();
  };

  const handleStartGamePress = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
  };

  const handleRestartPress = () => {
    setGameStarted(false);
    setAiState([]);
    setPlayerState([]);
    setRandomButtonDisabled(false);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
    <View style={styles.background} />
      <Text>{gameOver ? 'Game Over!' : 'Battleship Game'}</Text>
      {!gameStarted &&
        <TouchableOpacity style={styles.button} onPress={handleStartGamePress}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      }
      {!gameStarted &&
        <TouchableOpacity style={styles.button} onPress={handleRandomizePress} disabled={randomButtonDisabled}>
          <Text style={styles.buttonText}>Random</Text>
        </TouchableOpacity>
      }
      
      {gameStarted &&
        <TouchableOpacity style={styles.button} onPress={handleRestartPress}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      }
      <View style={styles.board}>
        {Board.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((cell, j) => (
              <TouchableOpacity
                key={j}
                style={[styles.cell, (!gameStarted && cell === 1) && styles.shipCell, cell === 'X' && styles.hitCell, cell === 'O' && styles.missCell]}
                onPress={() => handleCellPress(i, j)}
                disabled={cell === 'X' || cell === 'O' || gameOver || (gameStarted && !playerTurn)}>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    width: '80%',
    marginBottom: 10,
    padding: 10,
  },
  board: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2F4F4F', // Set your desired background color
  },
  cell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipCell: {
    backgroundColor: 'gray', // Color to represent ships
  },
  hitCell: {
    backgroundColor: 'red',
  },
  missCell: {
    backgroundColor: 'white',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  
});
