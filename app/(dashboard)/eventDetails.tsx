import { Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'
import {useTheme} from "@/context/ThemeContext";

const eventDetails = () => {
  const {colorScheme} = useTheme()

  const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black' : 'text-black bg-white'}`


  return (
    <View className={`flex-1 items-center justify-center ${applyTheme}`}>
      <Text className={`text-xl font-bold mt-2 ${applyTheme}`}>eventDetails</Text>

      <Link href='/' className={`my-2 border-b ${applyTheme}`}>Home</Link>
    </View>
  )
}

export default eventDetails
