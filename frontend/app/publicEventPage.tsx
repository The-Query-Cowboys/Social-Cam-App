import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const PublicEventPage = () => {
  return (
    <View style={styles.container}>
      
      <Text style={styles.text}>Event</Text>

      <Link href='/' style={styles.link}>Home</Link>
      <Link href='/eventDetails' style={styles.link}>Event Details</Link>
    </View>
  )
}

export default PublicEventPage

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
    marginVertical: 10,
    borderBottomWidth: 1,
  }
})