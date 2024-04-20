import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { DataTable, Button } from 'react-native-paper';  // Import Button component
import { BASEURL } from '../config.js';

const Leaderboard = ({ setUser, setLoggedIn, setShowLeaderboard, setIsGameStarted }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/users/leaderboard`);
        if (!response.ok) throw new Error('Failed to fetch: ' + response.status);
        const data = await response.json();
        data.sort((a, b) => b.wins - a.wins || b.shipsSunk - a.shipsSunk || b.losses - a.losses);
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to load data: ' + error.message);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleSignOut = () => {
    setUser(null);
    setLoggedIn(false);
    setShowLeaderboard(false);
  }

  const openGame = () => {
    setIsGameStarted(true);
    setShowLeaderboard(false);
  }

  return (
    <ImageBackground source={require('./wallpaper.png')} style={styles.background}>
      <DataTable style={styles.container}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title>Username</DataTable.Title>
          <DataTable.Title numeric>Wins</DataTable.Title>
          <DataTable.Title numeric>Losses</DataTable.Title>
          <DataTable.Title numeric>Ships Sunk</DataTable.Title>
        </DataTable.Header>
        {users.map((user, index) => (
          <DataTable.Row style={styles.white} key={index}>
            <DataTable.Cell style={styles.userCell}>{user.username}</DataTable.Cell>
            <DataTable.Cell numeric style={styles.cell}>{user.wins}</DataTable.Cell>
            <DataTable.Cell numeric style={styles.cell}>{user.losses}</DataTable.Cell>
            <DataTable.Cell numeric style={styles.cell}>{user.shipsSunk}</DataTable.Cell>
          </DataTable.Row>
        ))}
        <DataTable.Row style={styles.white}>
        <DataTable.Cell style={{ backgroundColor: 'white', flex: 2 }}>
              <Button mode="contained" onPress={() => openGame()}>Play</Button>
              <Button mode="contained" onPress={() => handleSignOut()}>Sign Out</Button>
            </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </ImageBackground>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
  container: {
    paddingTop: 80
  },
  userCell: {
    flex: 1,
    backgroundColor: "white"
  },
  cell: {
    backgroundColor: 'white',
    flex: 1
  },
  dataTableContainer: {
    flex: 1,
  },  
  white: {
    backgroundColor: "white"
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
