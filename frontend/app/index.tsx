import { Text, View, Image } from 'react-native'
import { Link } from 'expo-router'
// @ts-ignore
import icon from '../assets/favicon.png'
import React from 'react'
import { useTheme } from "@/context/ThemeContext"
import DarkModeToggle from "@/app/components/DarkModeToggle";

const Home = () => {
    const { colorScheme } = useTheme()

    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black': 'text-black bg-white'}`

    return (
        <View className={`flex-1 items-center justify-center ${applyTheme}`}>
            <View className="absolute top-4 right-4 items-center">
                <Text className={`${applyTheme}`}>Theme: </Text>
                <DarkModeToggle />
            </View>
            <Image source={icon} className="my-4" />
            <Text className={`text-xl font-bold mt-2 ${applyTheme}`}>Home</Text>
            <Text className={`text-xl font-bold mt-2 ${applyTheme}`}>Hello world</Text>
            <Link href='/publicEventPage' className={`my-2 border-b ${applyTheme}`}>Event Page</Link>
            <Link href='/createEvent' className={`my-2 border-b ${applyTheme}`}>Create Event</Link>
            <Link href='/logInPage' className={`my-2 border-b ${applyTheme}`}>Login</Link>
        </View>
    )
}

export default Home
