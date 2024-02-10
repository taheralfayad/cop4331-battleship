import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const initialShips = [
    { coordinates: [[0, 1], [0, 2], [0, 3]], hits: [], isSunk: false },
];

const GridCell = ({ status, onPress }) => {
    let backgroundColor = '#fff';
    if (status === 'ship') backgroundColor = '#bbb';
    else if (status === 'hit') backgroundColor = 'red';
    else if (status === 'miss') backgroundColor = 'blue';

    return (
        <TouchableOpacity
            style={[styles.cell, { backgroundColor }]}
            onPress={onPress}
        />
    );
};

const BattleshipGrid = () => {
    const gridSize = 10;
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [ships, setShips] = useState(initialShips);
    const [grid, setGrid] = useState(Array(gridSize).fill(Array(gridSize).fill('empty')));

    const handleCellPress = (row, col) => {
        if (currentPlayer !== 1) {
            console.log("It's not your turn");
            return;
        }

        if (grid[row][col] !== 'empty') {
            console.log('Cell already guessed');
            return;
        }

        let hitShip = false;
        const newShips = ships.map(ship => {
            if (ship.coordinates.some(coord => coord[0] === row && coord[1] === col)) {
                hitShip = true;
                return { ...ship, hits: [...ship.hits, [row, col]] };
            }
            return ship;
        });

        const newGrid = [...grid];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = hitShip ? 'hit' : 'miss';

        setGrid(newGrid);
        setShips(newShips);

        newShips.forEach(ship => {
            if (ship.hits.length === ship.coordinates.length && !ship.isSunk) {
                console.log('Ship sunk!');
                ship.isSunk = true;
            }
        });

        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    };

    return (
        <View style={styles.grid}>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.gridRow}>
                    {row.map((cell, colIndex) => (
                        <GridCell
                            key={`${rowIndex}-${colIndex}`}
                            status={cell}
                            onPress={() => handleCellPress(rowIndex, colIndex)}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'column',
    },
    gridRow: {
        flexDirection: 'row',
    },
    cell: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: '#000',
    },
});

export default BattleshipGrid;
