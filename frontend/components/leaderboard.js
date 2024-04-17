import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const retrieveTopUsers = async () => {
      try {
        const response = await fetch('https://5588-208-64-158-97.ngrok-free.app/api/users/leaderboard');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error retrieving leaderboard:', error);
      }
    };

    retrieveTopUsers();
  }, []);

  const renderUserItem = ({ item, index }) => {
    return (
      <View style={styles.userContainer}>
        <Text style={styles.rank}>{index + 1}.</Text>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.stat}>{item.wins}</Text>
        <Text style={styles.stat}>{item.losses}</Text>
        <Text style={styles.stat}>{item.shipsSunk}</Text>
        <Text style={styles.stat}>{item.score}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewStyle}>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.leaderboard}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Rank</Text>
            <Text style={styles.header}>Username</Text>
            <Text style={styles.header}>Wins</Text>
            <Text style={styles.header}>Losses</Text>
            <Text style={styles.header}>Ships Sunk</Text>
            <Text style={styles.header}>Score</Text>
          </View>
          {users.length === 0 && <Text>Loading...</Text>}
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewStyle: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  leaderboard: {
    width: windowWidth, 
    height: windowHeight *.8,
    padding: 10,
    borderRadius: 0,
    backgroundColor: '#ffffff',
    elevation: 5, 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  rank: {
    flex: 1,
    textAlign: 'center',
  },
  username: {
    flex: 1,
    textAlign: 'center',
  },
  stat: {
    flex: 1,
    textAlign: 'center',
  },
});

export default Leaderboard;
