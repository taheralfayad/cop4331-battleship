
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './components/loginScreen'; // Import your login screen component
import GameScreen from './components/GameScreen'; // Import your game screen component

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <View style={styles.container}>
      {loggedIn ? <GameScreen /> : <LoginScreen setLoggedIn={setLoggedIn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'stretch',
  },
});