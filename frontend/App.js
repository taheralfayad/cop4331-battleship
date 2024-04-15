
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './components/loginScreen'; // Import your login screen component
import GameScreen from './components/GameScreen'; // Import your game screen component

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      console.log(user)
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {loggedIn ? <GameScreen user={user} setUser={setUser} /> : <LoginScreen setUser={setUser} setLoggedIn={setLoggedIn} />}
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