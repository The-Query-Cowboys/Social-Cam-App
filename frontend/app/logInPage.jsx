import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const logInPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>log-In </Text>
      <form action="" style={styles.form}>
        <input style={styles.input} type="text" placeholder='Username' />
        <input style={styles.input} type="password" placeholder='Password' />
        <button style={styles.button} type='submit'>Login</button>
      </form>
      <Text>Don't have an account?
        <Link href='/signUpPage' style={styles.link}>Sign Up</Link>
      </Text>
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
    
  }
})