import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const signUpPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign Up</Text>
      <form style={styles.form} action="">
        <input style={styles.input} type="text" placeholder='Name' />
        <input style={styles.input} type="text" placeholder='Nickname' />
        <input style={styles.input} type="text" placeholder='Introduce yourself!' />
        <input style={styles.input} type="text" placeholder='Email' />
        <input style={styles.input} type="password" placeholder='Password' />
        <input style={styles.input} type="password" placeholder='Confirm Password' />
        <button style={styles.button} type='submit'>Sign Up</button>
      </form>
      <Text>Already have an account? <Link href='/logInPage' style={styles.link}>Log In</Link></Text>
    </View>
  )
}
/* 
name
nickname
description
password (encrypted)
email
*/

export default signUpPage

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
        borderRadius: 5,
      }
})