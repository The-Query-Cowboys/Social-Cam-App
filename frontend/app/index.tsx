import { StyleSheet, Text, View, Image } from 'react-native'
import { Link } from 'expo-router'

import icon from '../assets/favicon.png'
import React from 'react'

const Home = () => {
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.image} />

      <Text style={styles.text}>Home</Text>
      <Text style={styles.text}>Hello world</Text>

      <Link href='/publicEventPage' style={styles.link}>Event Page</Link>
      <Link href='/createEvent' style={styles.link}>Create Event</Link>
      <Link href='/logInPage' style={styles.link}>Login</Link>

    </View>
  )
}


export default Home

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