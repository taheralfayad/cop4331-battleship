// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ setLoggedIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/login?username=' + username + '&password=' + password);
      const data = await response.json();
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
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: registerName, password: registerPassword, email: registerEmail }),
      });
      const data = await response.json();
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
          <View style={styles.container}>
            <Text>Login or Register to Play!</Text>
            <Text>Login</Text><TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />   
            <Button title="Login" onPress={handleLogin} />
            <Text>Register</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={registerName}
              onChangeText={setRegisterName}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={registerPassword}
              onChangeText={setRegisterPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={registerEmail}
              onChangeText={setRegisterEmail}
            />
            <Button title="Register" onPress={handleRegister} />
    
          </View>
        )
      }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    width: '80%',
    marginBottom: 10,
    padding: 10,
  },
});