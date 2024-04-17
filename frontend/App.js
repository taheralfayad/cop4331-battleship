
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './components/loginScreen'; // Import your login screen component
import GameScreen from './components/GameScreen'; // Import your game screen component
import Leaderboard from './components/Leaderboard';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    if (user) {
      console.log(user)
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {loggedIn && !showLeaderboard && isGameStarted ? (
        <>
          <GameScreen setIsGameStarted={setIsGameStarted} setShowLeaderboard={setShowLeaderboard} setLoggedIn={setLoggedIn} user={user} setUser={setUser} />
        </>
      ) : null}
      {!loggedIn && !showLeaderboard ? (
        <LoginScreen setIsGameStarted={setIsGameStarted} setUser={setUser} setLoggedIn={setLoggedIn} />
      ) : null}
      {loggedIn && showLeaderboard && !isGameStarted && <Leaderboard setIsGameStarted={setIsGameStarted} setShowLeaderboard={setShowLeaderboard} setUser={setUser} setLoggedIn={setLoggedIn}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});