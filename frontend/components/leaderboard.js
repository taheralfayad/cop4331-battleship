// Leaderboard.js - Version #18
// Changes Made:
// - Further adjusted font sizes, padding, and styling for better visibility.

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Leaderboard = () => {
  const hardcodedLeaderboardData = [
    { username: 'You', rank: 1, wins: 10, losses: 5, shipsSunk: 30, shipsLost: 10 },
    { username: 'Ai', rank: 2, wins: 8, losses: 7, shipsSunk: 25, shipsLost: 15 },
    // Add more entries as needed
  ];

  return (
    <ScrollView contentContainerStyle={styles.leaderboardContainer}>
      {/* LEADERBOARD HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>LEADERBOARD</Text>
      </View>

      {/* TABLE CONTAINER */}
      <View style={styles.tableContainer}>
        {/* HEADER ROW */}
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}></Text>
          <Text style={styles.headerRowsStyle}>YOU</Text>
          <Text style={styles.headerRowsStyle}>AI    </Text>
        </View>

        {/* RANKING ROW */}
        <View style={[styles.row, styles.highlightRow]}>
          <Text style={styles.cellTitle}>🏅 Rank</Text>
          <Text style={styles.cell}>{hardcodedLeaderboardData[0].rank}</Text>
          <Text style={styles.cell}>{hardcodedLeaderboardData[1].rank}</Text>
        </View>

        {/* WINS ROW */}
        <View style={styles.row}>
          <Text style={styles.cellTitle}>🏆 Games Won</Text>
          <Text style={styles.cell}>{hardcodedLeaderboardData[0].wins}</Text>
          <Text style={styles.cell}>{hardcodedLeaderboardData[1].wins}</Text>
        </View>

        {/* LOSSES ROW */}
        <View style={[styles.row, styles.highlightRow]}>
          <Text style={styles.cellTitle}>💔 Games Lost</Text>
          <Text style={styles.cell}>{hardcodedLeaderboardData[0].losses}</Text>
          <Text style={styles.cell}>{hardcodedLeaderboardData[1].losses}</Text>
        </View>

        {/* SHIPS SUNK ROW */}
        <View style={styles.row}>
          <Text style={styles.cellTitle}>
            🎯 Ships Sunk
          </Text>
          <Text style={styles.cell}>{hardcodedLeaderboardData[0].shipsSunk}</Text>
          <Text style={styles.cell}>{hardcodedLeaderboardData[1].shipsSunk}</Text>
        </View>

        {/* SHIPS LOST ROW */}
        <View style={[styles.row, styles.highlightRow]}>
          <Text style={styles.cellTitle}>
            💥 Ships Lost
          </Text>
          <Text style={styles.cell}>{hardcodedLeaderboardData[0].shipsLost}</Text>
          <Text style={styles.cell}>{hardcodedLeaderboardData[1].shipsLost}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// STYLES
const styles = StyleSheet.create({
  leaderboardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darknavy', // Updated to dark navy blue
  },
  header: {
    backgroundColor: 'grey',
    padding: 20, // Increased padding
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 32, // Further increased font size
    fontWeight: 'bold',
    color: 'white',
  },
  tableContainer: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    width: '115%', // Full width of the screen
  },
  headerRowsStyle: {
    flex: 1,
    textAlign: 'right',
    color: 'white',
    fontSize: 22, // Further increased font size
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'grey',
    padding: 20, // Increased padding
    justifyContent: 'space-around',
  },
  headerCell: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
    fontSize: 24, // Further increased font size
  },
  row: {
    flexDirection: 'row',
    padding: 20, // Increased padding
    justifyContent: 'space-around',
  },
  cellTitle: {
    flex: 2, // Increased flex to make the column wider
    textAlign: 'left',
    fontSize: 19, // Adjusted font size
    color: 'black', // Text color set to white
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 21, // Further increased font size
  },
  highlightRow: {
    backgroundColor: 'rgba(169, 169, 169, 0.2)', // Transparent grey background
  },
});

export default Leaderboard;
