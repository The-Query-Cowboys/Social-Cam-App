import { Tabs } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
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
      name="Create event"
      options={{ title: "Create event" }} 
    />
      <Tabs.Screen 
        name="View Events"
        options={{ title: "View Events", }} 
      />
    <Tabs.Screen 
      name="Event details"
      options={{ title: "Event details" }} 
    />
  </Tabs>
  )
}

export default dashboardLayout

const styles = StyleSheet.create({})