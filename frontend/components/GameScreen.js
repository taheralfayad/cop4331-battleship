import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TouchableNativeFeedback, ImageBackground } from 'react-native';
import ShipPlacementModal from './shipPlacementModal';
import AIManager from './AIManager';

const BOARD_SIZE = 10;
const CELL_SIZE = 27;
const ships = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
];

const AILogic = new AIManager(BOARD_SIZE);

const BattleshipBoard = () => {
  const [playerBoard, setPlayerBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)));
  const [aiBoard, setAiBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const toggleModal = () => {
    setGameStarted(!gameStarted);
  };

  useEffect(() => {
    setAiBoard(placeAllShips());
  }, []);

  const initializeBoard = () => Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));

  const checkIfFits = (board, row, col, size, isHorizontal) => {
    if (isHorizontal) {
      if (col + size > BOARD_SIZE) return false; 
      for (let i = 0; i < size; i++) {
        if (board[row][col + i] !== null) return false; 
      }
    } else {
      if (row + size > BOARD_SIZE) return false; 
      for (let i = 0; i < size; i++) {
        if (board[row + i][col] !== null) return false;
      }
    }
    return true;
  };

  const placeShip = (board, ship) => {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random() * BOARD_SIZE);
      let col = Math.floor(Math.random() * BOARD_SIZE);
      let isHorizontal = Math.random() > 0.5;
  
      if (checkIfFits(board, row, col, ship.size, isHorizontal)) {
        for (let i = 0; i < ship.size; i++) {
          if (isHorizontal) {
            board[row][col + i] = ship.name[0];
          } else {
            board[row + i][col] = ship.name[0];
          }
        }
        placed = true;
      }
    }
  };
  
  const placeAllShips = () => {
    const board = initializeBoard();
    ships.forEach(ship => {
      placeShip(board, ship);
    });
    return board;
  };

  const isAlphabetical = (str) => {
    return /^[A-Za-z]+$/.test(str);
  }

  const onCellPress = (row, col, playerOrAI) => {
    if (playerOrAI === 1 && currentPlayer === 0) {
      setAiBoard(prevBoard => {
        let newBoard = prevBoard.map(arr => arr.slice());
        
        if (newBoard[row][col] !== null && isAlphabetical(newBoard[row][col]) || newBoard[row][col] === 2) {
          newBoard[row][col] = 2;

          return newBoard;
        }
        else if (newBoard[row][col] === 1) {
          return newBoard;
        }
        else {
          setCurrentPlayer(1);
          handleAIMove();
          newBoard[row][col] = 1;     
        }
   
        return newBoard;
      });
    }
  };

  const handleAIMove = () => {
    setPlayerBoard(prevBoard => {
      const wasLastMoveHit = { hit: false };
      const newBoard = AILogic.getNextMove(prevBoard, wasLastMoveHit);
      
      if (wasLastMoveHit.hit) {
        setCurrentPlayer(1);
        setTimeout(() => handleAIMove(), 1000);
      } else {
        setCurrentPlayer(0); 
      }
  
      return newBoard;
    });
  };
  


  const renderPlayerCell = (row, col) => {
    if(playerBoard[row][col] === null || isAlphabetical(playerBoard[row][col])) {
      return(
      <TouchableOpacity
          key={`${row}-${col}`}
          style={styles.cell}
          onPress={() => onCellPress(row, col, 0)}
        >
          <Text style={styles.whiteText}>{playerBoard[row][col]}</Text>
        </TouchableOpacity>);
      }
      else if(playerBoard[row][col] === 1) {
        return(
        <TouchableOpacity
          key={`${row}-${col}`}
          style={styles.takenCell}
          onPress={() => onCellPress(row, col, 0)}
        >
          <Text style={styles.x}>✖️</Text>
        </TouchableOpacity>);
      }
      else if(playerBoard[row][col] === 2) {
        return(
        <TouchableOpacity
          key={`${row}-${col}`}
          style={styles.hitCell}
          onPress={() => onCellPress(row, col, 0)}
        >
          <Text style={styles.x}>🔴</Text>
        </TouchableOpacity>);
      }
  };

  const renderAiCell = (row, col) => {
    if(aiBoard[row][col] === null || isAlphabetical(aiBoard[row][col])) {
      return(
      <TouchableOpacity
          key={`${row}-${col}`}
          style={styles.cell}
          onPress={() => onCellPress(row, col, 1)}
        >
        </TouchableOpacity>);
      }
      else if(aiBoard[row][col] === 1) {
        return(
        <TouchableOpacity
          key={`${row}-${col}`}
          style={styles.takenCell}
          onPress={() => onCellPress(row, col, 1)}
        >
          <Text style={styles.x}>✖️</Text>
        </TouchableOpacity>);
      }
      else if(aiBoard[row][col] === 2) {
        return(
        <TouchableOpacity
          key={`${row}-${col}`}
          style={styles.hitCell}
          onPress={() => onCellPress(row, col, 1)}
        >
          <Text style={styles.x}>🔴</Text>
        </TouchableOpacity>);
      }
  }

  const renderPlayerBoard = () => {
    let board = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      let rowCells = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        rowCells.push(renderPlayerCell(row, col));
      }
      board.push(
        <View key={row} style={styles.row}>
          {rowCells}
        </View>
      );
    }
    return board;
  };

  const renderAiBoard = () => {
    let board = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      let rowCells = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        rowCells.push(renderAiCell(row, col));
      }
      board.push(
        <View key={row} style={styles.row}>
          {rowCells}
        </View>
      );
    }
    return board;
  }

  return (
    <ImageBackground source={require('./wallpaper.png')} style={styles.container}>
      <Text style={styles.boardTitle}>Ai BOARD</Text>
      {renderAiBoard()}
      <Text style={styles.boardTitle}>YOUR BOARD</Text>
      {!gameStarted && (
        <ShipPlacementModal
          onClose={toggleModal}
          playerBoard={playerBoard}
          setPlayerBoard={setPlayerBoard}
          ships={ships}
          placeAllShips={placeAllShips}
        />
      )}
      {renderPlayerBoard()}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  whiteText:
  {
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover', // Ensure the image covers the entire container
  },
  board: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    alignSelf: 'center', // Center horizontally within parent container
  },
  row: {
    flexDirection: 'row',
    // borderWidth: 0.1,  // Add border width to create the inside borders
    borderColor: '#686868',  // Add border color to match the cell borders
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#686868',
    borderStyle: 'dotted',
    alignItems: 'center', // Center vertically
    
  },
  takenCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#686868',
    borderStyle: 'dotted',
    // backgroundColor: '#0283c3',
    alignItems: 'center', // Center vertically
  },
  hitCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#686868',
    borderStyle: 'dotted',
    backgroundColor: '#ff000030',
  },
  x: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center', // Center horizontally
    textAlignVertical: 'center', // Center vertically
  },
  boardTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 9,
    color: 'white',
  },
});

export default BattleshipBoard;
