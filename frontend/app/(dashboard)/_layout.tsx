import { Tabs } from 'expo-router'
import React from 'react-native'
import { useTheme } from "@/context/ThemeContext"

const dashboardLayout = () => {
    const { colorScheme } = useTheme()
    // not sure if this is necessary, tab styles don't use the same nomenclature as nativewind for strings
    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black': 'text-black bg-white'}`

  return (
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: 'dark', paddingTop: 10, height: 90},
      tabBarActiveTintColor:'rgba(0,21,255,0.55)',
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