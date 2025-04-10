import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const logInPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>log-In </Text>
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
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  link: {
    marginVertical: 50,
    borderBottomWidth: 1,
    borderColor: '#000',
  }
})