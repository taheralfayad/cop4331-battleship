import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const ships = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
];

const ShipPlacementModal = ({ onClose, placeAllShips, setPlayerBoard, ships, visible}) => {
  const [selectedShip, setSelectedShip] = useState(null);
  const [orientation, setOrientation] = useState('horizontal');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [board, setBoard] = useState(Array(10).fill(null).map(() => Array(10).fill(null)));
  const [placedShips, setPlacedShips] = useState([]);


  const handleSelectShip = (ship) => {
    if (!placedShips.includes(ship.name)) {
      setSelectedShip(ship);
    } else {
      alert(`${ship.name} has already been placed. Please choose a different ship.`);
    }
  }
  

  const calculateShipCoverage = (startSquare, shipSize, orientation) => {
    const coverage = [];
    if (startSquare) {
      const [startRow, startCol] = startSquare;
      for (let i = 0; i < shipSize; i++) {
        if (orientation === 'horizontal') {
          coverage.push([startRow, startCol + i]);
        } else {
          coverage.push([startRow + i, startCol]);
        }
      }
    }
    return coverage;
  };


  const isShipPlacementValid = (startSquare, shipSize, orientation) => {
    if (startSquare) {
      const [startRow, startCol] = startSquare;
      if (orientation === 'horizontal') {
        return startCol + shipSize <= 10; 
      } else {
        return startRow + shipSize <= 10; 
      }
    }
    return false;
  };
  

  const onPlaceShip = (selectedShip, selectedSquare, orientation) => {
    const newBoard = board.map(row => [...row]);
    const coverage = calculateShipCoverage(selectedSquare, selectedShip.size, orientation);
    let isValidPlacement = true;
  
    coverage.forEach(([row, col]) => {
      if (row >= 10 || col >= 10 || newBoard[row][col] !== null) {
        isValidPlacement = false;
      }
    });
  
    if (isValidPlacement) {
      coverage.forEach(([row, col]) => {
        newBoard[row][col] = selectedShip.name.substring(0, 2).toUpperCase();
      });
      
      setBoard(newBoard);
      setPlayerBoard(newBoard);

      if (!placedShips.includes(selectedShip.name)) {
        setPlacedShips([...placedShips, selectedShip.name]);
      }
    } else {
      // Notify the user if the placement was invalid
      alert("Invalid placement. Please choose a different location or orientation.");
    }
  };
  
  const randomizeShips = () => {
    setBoard(placeAllShips());
    setPlayerBoard(placeAllShips());
    onClose();
  };


  const handlePlaceShip = () => {
    if (selectedShip && selectedSquare) {
      if (isShipPlacementValid(selectedSquare, selectedShip.size, orientation)) {
        onPlaceShip(selectedShip, selectedSquare, orientation);
        setSelectedShip(null);
        setSelectedSquare(null);
        setOrientation('horizontal');
      } else {
        alert("Ship placement is out of bounds. Please select a valid position.");
      }
    }
  };
  
  const renderSquare = ({ item }) => {
    const [row, col] = item;
    const isSquareOccupied = board[row][col] !== null;
    const isSelected = selectedSquare && row === selectedSquare[0] && col === selectedSquare[1];
  
    const potentialCoverage = selectedShip && selectedSquare
      ? calculateShipCoverage(selectedSquare, selectedShip.size, orientation)
      : [];
  
    const isInPotentialCoverage = potentialCoverage.some(coverageItem => coverageItem[0] === row && coverageItem[1] === col);
  
    return (
      <TouchableOpacity
        style={[
          styles.square,
          isSquareOccupied && styles.occupiedSquare,
          (isSelected || isInPotentialCoverage) && styles.selectedSquare, 
        ]}
        onPress={() => !isSquareOccupied && setSelectedSquare(item)}
      >
        <Text>{`${row}${col}`}</Text>
      </TouchableOpacity>
    );
  };
  
  
  
  

  const renderOrientationButton = (text, value) => (
    <TouchableOpacity
      style={[styles.orientationButton, orientation === value && styles.selectedOrientation]}
      onPress={() => setOrientation(value)}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView style={styles.scrollViewStyle}>
          <Text style={styles.modalText}>Select a ship to place:</Text>
          <FlatList
            data={ships}
            renderItem={({ item }) => {
              const isShipPlaced = placedShips.includes(item.name);
              return (
                <TouchableOpacity
                  style={[
                    styles.shipButton,
                    selectedShip && selectedShip.name === item.name
                      ? styles.selectedShip
                      : null,
                    isShipPlaced && styles.placedShip, // Add this line
                  ]}
                  onPress={() => handleSelectShip(item)}
                  disabled={isShipPlaced} // Optionally disable the button
                >
                <Text style={[{ textAlign: 'center' }, isShipPlaced ? styles.placedShipText : {}]}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.name}
          />
          {selectedShip && (
            <View>
              <Text style={styles.modalText}>Select Square:</Text>
              <FlatList
                data={Array.from({ length: 100 }, (_, index) => [
                  Math.floor(index / 10),
                  index % 10,
                ])}
                renderItem={renderSquare}
                numColumns={10}
                keyExtractor={(item, index) => `${index}`}
              />
              <Text style={styles.modalText}>Select Orientation:</Text>
              <View style={styles.orientationContainer}>
                {renderOrientationButton('Horizontal', 'horizontal')}
                {renderOrientationButton('Vertical', 'vertical')}
              </View>
              <TouchableOpacity style={styles.placeButton} onPress={handlePlaceShip}>
                <Text style={styles.textStyle}>Place Ship</Text>
              </TouchableOpacity>
            </View>
          )}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            if (placedShips.length === 0) {
              randomizeShips();
            } else if (placedShips.length === 5) { 
              alert("All ships have already been placed.");
            } else {
              alert("You must finish placing all ships now.");
            }
          }}
        >
          <Text style={styles.textStyle}>Place Random</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            if (placedShips.length === ships.length) {
              onClose();
            } else {
              alert("You must place all ships before closing.");
            }
          }}
        >
          <Text style={styles.textStyle}>Close</Text>
        </TouchableOpacity>
        </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10, 
    minWidth: 100,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  
placedShip: {
  backgroundColor: "#f0f0f0",
  borderColor: 'white', 
},
placedShipText: {
  color: 'white', 
  textAlign: "center",
},

selectedShip: {
    backgroundColor: "#ADD8E6", 
    },
    selectedSquare: {
    borderColor: "#2196F3", 
    borderWidth: 2,
    },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: '90%', // This assumes that the modal should take up 90% of the screen width
    maxHeight: '90%', // Consider the maximum height as well
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20, // Make sure this padding isn't causing the content to squeeze out
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  
  
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  shipButton: {
    backgroundColor: "#f0f0f0", 
    padding: 10,
    marginVertical: 5,
    borderRadius: 5
  },
  square: {
    width: (windowWidth * 0.9 - 60) / 10 - 6, // This accounts for modal padding and square margins
    height: (windowWidth * 0.9 - 60) / 10 - 6, // Same height as width for square cells
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 3,
  },
  
  orientationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    color: 'white',
  },
  orientationButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    color: 'white',
  },
  selectedOrientation: {
    backgroundColor: '#2196F3',
    color: 'white',
  },
  placeButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5
  },
  closeButton: {
    backgroundColor: "#f44336",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  occupiedSquare: {
    backgroundColor: "#808080",
  },
  shipListContainer: {
    maxHeight: windowHeight * 0.3, 
    width: '100%',
  },
  squareGrid: {
    width: '100%',
    maxHeight: (windowWidth * 0.9 - 60) / 10 * 10 + 30, // This formula ensures that it scales with the square size
  },
  

});

export default ShipPlacementModal;
