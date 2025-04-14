import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'

import React from 'react'

const createEvent = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>createEvent page</Text>

            <Link href='/' style={styles.link}>Home</Link>
            <Link href='/publicEventPage' style={styles.link}>Event Page</Link>
        </View>
    )
}

export default createEvent

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
        marginVertical: 50,
        borderBottomWidth: 1,
      }
})