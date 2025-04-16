import { Tabs } from 'expo-router'
import React from 'react-native'
import { useTheme } from "@/context/ThemeContext"

const dashboardLayout = () => {
    const { colorScheme } = useTheme()

    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black': 'text-black bg-white'}`

  return (
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: applyTheme, paddingTop: 10, height: 90 },
      tabBarActiveTintColor:'#fff',
      tabBarInactiveTintColor: '#000',
    }}
  >

    <Tabs.Screen
      name="createEvent"
      options={{ title: "Create event" }}
    />

    <Tabs.Screen
    name="publicEventPage"
    options={{ title: "Public events", }}
    />

    <Tabs.Screen
      name="eventDetails"
      options={{ title: "Event details" }}
    />

  </Tabs>
  )
}

export default dashboardLayout