import '../global.css'
import { Stack } from 'expo-router'
import { StyleSheet, StatusBar, View,Text } from 'react-native'

const RootLayout = () => {
  return (
        <Stack screenOptions={{

          headerStyle:{backgroundColor:'#ddd'},
          headerTintColor:'#333',
        }
        }>
          <Stack.Screen name='index' options={{ title: 'Home' }} />
          <Stack.Screen name='eventDetails' options={{ title: 'Event Details' }} />
          <Stack.Screen name='publicEventPage' options={{ title: 'All Events nearby' }} />
          <Stack.Screen name='createEvent' options={{ title: 'Create new event' }} />
          <Stack.Screen name='logInPage' options={{ title: 'Login' }} />
        </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({

})
