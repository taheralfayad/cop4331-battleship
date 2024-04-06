import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ShipPlacementModal from './shipPlacementModal';
import AIManager from './AIManager';

const BOARD_SIZE = 10;
const CELL_SIZE = 30;
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
    setAiBoard(placeAllAIShips());
  }, [])

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
  
  const placeAllAIShips = () => {
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

        newBoard[row][col] = 1;
        
        return newBoard;
      });
      setCurrentPlayer(1);
      handleAIMove();
    }
  
  };

  const handleAIMove = () => {
    setPlayerBoard(AILogic.getNextMove(playerBoard));
    setCurrentPlayer(0);
  };


  const renderPlayerCell = (row, col) => {
    if(playerBoard[row][col] === null || isAlphabetical(playerBoard[row][col])) {
      return(
      <TouchableOpacity
          key={`${row}-${col}`}
          style={styles.cell}
          onPress={() => onCellPress(row, col, 0)}
        >
          <Text>{playerBoard[row][col]}</Text>
        </TouchableOpacity>);
      }
      else if(playerBoard[row][col] === 1) {
        return(
        <TouchableOpacity
          key={`${row}-${col}`}
          style={styles.takenCell}
          onPress={() => onCellPress(row, col, 0)}
        >
        </TouchableOpacity>);
      }
      else if(playerBoard[row][col] === 2) {
        return(
        <TouchableOpacity
          key={`${row}-${col}`}
          style={styles.hitCell}
          onPress={() => onCellPress(row, col, 0)}
        >
          <Text>X</Text>
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
        </TouchableOpacity>);
      }
      else if(aiBoard[row][col] === 2) {
        return(
        <TouchableOpacity
          key={`${row}-${col}`}
          style={styles.hitCell}
          onPress={() => onCellPress(row, col, 1)}
        >
          <Text>X</Text>
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
    <View style={styles.board}>
      <Text>AI Board</Text>
      {renderAiBoard()}
      <Text>Your Board</Text>
      {!gameStarted && (
        <ShipPlacementModal
          onClose={toggleModal}
          playerBoard={playerBoard}
          setPlayerBoard={setPlayerBoard}
          ships={ships}
        />
      )}
      {renderPlayerBoard()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  board: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#000',
  },
  takenCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    backgroundColor: 'red',
  },
  hitCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    backgroundColor: 'blue',
  }
});

export default BattleshipBoard;
