import React, { useState } from 'react';
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, SafeAreaView } from 'react-native';

export default function LoginScreen({ setUser, setLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), 
      });
      const data = await response.json();
      setUser(data);
      if (response.ok && data) {
        setLoggedIn(true);
      } else {
        // Handle failed login (e.g., display error message)
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('https://localhost:3000/api/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: registerName, password: registerPassword, email: registerEmail }),
      });
      const data = await response.json();
      setUser(data);
      if (response.ok) {
        setLoggedIn(true);
      } else {
        // Handle failed registration (e.g., display error message)
        console.error('Registration failed:', data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <ImageBackground source={require('./wallpaper.png')} style={styles.background}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <SafeAreaView style={styles.container}>
          <Text style={styles.appTitle}>BATTLESHIP</Text>
          <Text style={styles.boardTitle}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor={'white'}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={'white'}
          />
          <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.orDivider}>————  or  ————</Text>
          <Text style={styles.boardTitle}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={registerName}
            onChangeText={setRegisterName}
            placeholderTextColor={'white'}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={registerPassword}
            onChangeText={setRegisterPassword}
            placeholderTextColor={'white'}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={registerEmail}
            onChangeText={setRegisterEmail}
            placeholderTextColor={'white'}
          />
          <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
  
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF23',
    color: 'white',
    fontSize: 16,
    width: '80%',
    marginBottom: 10,
    padding: 10,
    opacity: 0.8,
    borderRadius: 3,
    zIndex: 1,
  },
  button: {
    width: '80%',
    padding: 11,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#2196F3',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
  },
  appTitle: {
    fontSize: 38, 
    fontWeight: "bold",
    marginBottom: 30,
    color: 'white',
  },
  boardTitle: {
    fontSize: 24, 
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 9,
    color: 'white',
  },
  orDivider: {
    fontSize: 16, 
    fontWeight: 'normal', 
    color: 'white',
    marginTop: 27,
    marginBottom: 11,
  }
});
