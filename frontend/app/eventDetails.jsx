import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const eventDetails = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>eventDetails</Text>

      <Link href='/' style={styles.link}>Home</Link>
    </View>
  )
}

export default eventDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  image: {
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  }
})