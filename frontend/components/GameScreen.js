import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TouchableNativeFeedback, ImageBackground } from 'react-native';
import ShipPlacementModal from './shipPlacementModal';
import AIManager from './AIManager';

const BOARD_SIZE = 10;
const CELL_SIZE = 27;
const ships = [
  { name: "Carrier", size: 5, hits: 0 },
  { name: "Battleship", size: 4, hits: 0 },
  { name: "Cruiser", size: 3, hits: 0 },
  { name: "Submarine", size: 3, hits: 0 },
  { name: "Destroyer", size: 2, hits: 0 },
];


const AILogic = new AIManager(BOARD_SIZE);

const BattleshipBoard = ({user, setUser}) => {
  const [playerBoard, setPlayerBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)));
  const [aiBoard, setAiBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [playerShips, setPlayerShips] = useState(ships.map(ship => ({ ...ship })));
  const [aiShips, setAiShips] = useState(ships.map(ship => ({ ...ship })));
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      checkGameOver();
    }
  }, [playerShips, aiShips]);

  const allShipsSunk = (ships) => {
    return ships.every(ship => ship.hits >= ship.size);
  };

  const updateShip = (playerOrAI, shipName) => {
    if (playerOrAI === 0) {
        setPlayerShips(currentShips => {
            return currentShips.map(ship => {
                if (ship.name === shipName) {
                    const updatedShip = { ...ship, hits: ship.hits + 1 };
                    return updatedShip;
                }
                return ship;
            });
        });
    } else {
        setAiShips(currentShips => {
            return currentShips.map(ship => {
                if (ship.name === shipName) {
                    return { ...ship, hits: ship.hits + 1 };
                }
                return ship;
            });
        });
    }
}

const calculateSunkShips = () => {
  let sunkShips = 0;
  aiShips.forEach(ship => { 
    if (ship.hits === ship.size) {
      sunkShips++;
    }
  });
  return sunkShips;
};
  

  const checkGameOver = () => {
    if (allShipsSunk(playerShips)) {
      alert('AI Wins!');
      sendGameResult('lose', calculateSunkShips());
      setGameStarted(false);
      setAiBoard(placeAllShips());
      setPlayerShips(ships.map(ship => ({ ...ship })));
      setAiShips(ships.map(ship => ({ ...ship })));
    } else if (allShipsSunk(aiShips)) {
      alert('Player Wins!');
      sendGameResult('win', 5);
      setGameStarted(false);
      setAiBoard(placeAllShips());
      setPlayerShips(ships.map(ship => ({ ...ship })));
      setAiShips(ships.map(ship => ({ ...ship })));
    }
  };

  const sendGameResult = async (winOrLose, shipsSunk) => {
    if(winOrLose === 'win') {
      body = JSON.stringify({ username: user.username, wins: user.wins + 1, losses: user.losses, shipsSunk: user.shipsSunk + shipsSunk });
    } else {
      body = JSON.stringify({ username: user.username, wins: user.wins, losses: user.losses + 1, shipsSunk: user.shipsSunk + shipsSunk });
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Game result sent successfully');
      } else {
        console.error('Failed to send game result:', data.message);
      }

      setUser({ ...user, wins: winOrLose === 'win' ? user.wins + 1 : user.wins, losses: winOrLose === 'lose' ? user.losses + 1 : user.losses, shipsSunk: user.shipsSunk + shipsSunk });
    } catch (error) {
      console.error('Error sending game result:', error);
    }
  };
    
  

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
            board[row][col + i] = ship.name.substring(0, 2).toUpperCase();
          } else {
            board[row + i][col] = ship.name.substring(0, 2).toUpperCase();
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

            if (newBoard[row][col] != null && isAlphabetical(newBoard[row][col])) {
              let shipName = ""
              if (newBoard[row][col] === 'CA') {
                shipName = "Carrier";
              } else if (newBoard[row][col] === 'BA') {
                shipName = "Battleship";
              } else if (newBoard[row][col] === 'CR') {
                shipName = "Cruiser";
              } else if (newBoard[row][col] === 'SU') {
                shipName = "Submarine";
              } else if (newBoard[row][col] === 'DE') {
                shipName = "Destroyer";
              }
                newBoard[row][col] = 2; 
                updateShip(1, shipName);
            } 
            else if(newBoard[row][col] === 1 || newBoard[row][col] === 2) {
              return newBoard;
            }
            else {
                newBoard[row][col] = 1;
                setCurrentPlayer(1);
                setTimeout(() => handleAIMove(), 1000);
            }
            return newBoard;
        });
    }
};

const handleAIMove = () => {
  const wasLastMoveHit = { hit: false, row: null, col: null };

  setPlayerBoard(prevBoard => {
      const newBoard = AILogic.getNextMove(prevBoard, wasLastMoveHit);
      
      if (wasLastMoveHit.hit) {
          let shipName = "";
          let hitLocation = prevBoard[wasLastMoveHit.row][wasLastMoveHit.col];

          switch(hitLocation) {
              case 'CA': shipName = "Carrier"; break;
              case 'BA': shipName = "Battleship"; break;
              case 'CR': shipName = "Cruiser"; break;
              case 'SU': shipName = "Submarine"; break;
              case 'DE': shipName = "Destroyer"; break;
              default: console.error("Unknown ship code:", hitLocation);
          }

          if (shipName) {
              updateShip(0, shipName);
          }

          setCurrentPlayer(1);
          if(currentPlayer == 1)
          {
            <Text style={styles.boardTitle}>Ai Turn</Text>
          }
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
      <Text style={currentPlayer === 0 ? styles.yourTurn : styles.aiTurn}>
        {currentPlayer === 0 ? "🔵 YOUR TURN" : "🔴 AI'S TURN"}
      </Text>
      <Text style={styles.boardTitle}>AI BOARD</Text>
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
    width: '100%', // Ensure the container is full-width
    height: '100%', // Ensure the container is full-height
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
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center', // Center horizontally
    textAlignVertical: 'center', // Center vertically
  },
  boardTitle: {
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 19,
    marginBottom: 6,
    color: 'white',
  },
  yourTurn: {

    fontSize: 20,
    fontWeight: 'bold',
    // textShadowColor: 'rgba(0, 0, 0, 1)', // shadow color
    // textShadowOffset: { width: 2, height: 2 }, // shadow offset
    // textShadowRadius: 2, // shadow radius   
    textAlignVertical: 'center', // Center vertically
    textAlign: 'center',
    overflow: 'hidden',
    color: 'white',
    width: '70%',
    padding: 9,
    marginTop: 0,
    marginBottom: 1,
    backgroundColor: '#00488150',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'white',
    // borderStyle: 'dotted',
  },
  aiTurn: {
    fontSize: 20,
    fontWeight: 'bold',
    // textShadowColor: 'rgba(0, 0, 0, 1)', // shadow color
    // textShadowOffset: { width: 2, height: 2 }, // shadow offset
    // textShadowRadius: 2, // shadow radius
    textAlignVertical: 'center', // Center vertically
    textAlign: 'center',
    overflow: 'hidden',
    color: 'white',
    width: '70%',
    padding: 9,
    marginTop: 0,
    marginBottom: 1,
    backgroundColor: '#e8122450',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'white',
    // borderStyle: 'dotted',
  },
});

export default BattleshipBoard;