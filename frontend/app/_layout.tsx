import { Stack } from 'expo-router'
import { StyleSheet, StatusBar, View } from 'react-native'

const RootLayout = () => {
  return (
    
    // <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name='index' options={{ title: 'Home' }} />
          <Stack.Screen name='eventDetails' options={{ title: 'Event Details' }} />
          <Stack.Screen name='publicEventPage' options={{ title: 'All Events nearby' }} />
          <Stack.Screen name='createEvent' options={{ title: 'Create new event' }} />
          <Stack.Screen name='logInPage' options={{ title: 'Login' }} />
        </Stack>
      </View>
  )
}
/* 
Stack:
  |
  |
  |eventDetails
  |publicEventPage
  |createEvent
  |index
-------------
*/
export default RootLayout

const styles = StyleSheet.create({

})
