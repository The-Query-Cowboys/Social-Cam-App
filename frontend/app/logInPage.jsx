import { StyleSheet, Text, View, TextInput, Button , Pressable} from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import React from 'react';

const logInPage = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onClick = () => {
    console.log(username, password)
    if (username === 'dev' && password === 'dev') {
      console.log('Login successful')
    } else {
      console.log('Login failed')
    }
  }

  return (
    <View className="flex-1 bg-white items-center justify-center p-4">
      <Text style={styles.text}>log-In </Text>
      <View style={styles.form}>
        <TextInput className="w-full p-3 border border-red-300 rounded-lg"
          type="text"
          placeholder='Username'
          placeholderTextColor="#666"
          onChangeText={setUsername} />

        <TextInput style={styles.input} type="password" secureTextEntry={true} placeholder='Password' placeholderTextColor="#666" onChangeText={setPassword} />

        <Button color='#000000' title='Login' type='submit' onPress={onClick} />
      </View>

      <Text>Don't have an account?
        <Link href='/signUpPage' style={styles.link}>Sign Up</Link>
      </Text>

      <Link href='/' style={styles.link}>Home</Link>
    </View>
  )
}

export default logInPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  link: {
    marginVertical: 50,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    backgroundColor: '#000',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  }
})