import { Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'
import {useTheme} from "@/context/ThemeContext";

const createEvent = () => {
    const { colorScheme } = useTheme()

    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black': 'text-black bg-white'}`

    return (
        <View className={`flex-1 justify-center items-center ${applyTheme}`}>
            <Text className={`text-xl font-bold mb-10 ${applyTheme}`}>createEvent page</Text>
            <Link href='/' className={`my-2 border-b mb-10 ${applyTheme}`}>Home</Link>
            <Link href='/publicEventPage' className={`my-2 border-b ${applyTheme}`}>Event Page</Link>
        </View>
    )
}


export default createEvent

