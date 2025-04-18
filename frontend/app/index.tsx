import { Text, View, Image } from 'react-native'
import { Link } from 'expo-router'
// @ts-ignore
import icon from '../assets/favicon.png'
import React from 'react'
import { useTheme } from "@/context/ThemeContext"
import DarkModeToggle from "@/app/components/DarkModeToggle";
//
import {SignedIn, SignedOut} from '@clerk/clerk-expo'
import {SignOutButton} from "@/app/(auth)/logOut";

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
            <Text className={`text-xl font-bold mt-5 ${applyTheme}`}>Hello world</Text>
            <Link href='/(dashboard)/publicEventPage' className={`my-5 border-b ${applyTheme}`}>Event Page</Link>
            <Link href='/(dashboard)/createEvent' className={`my-5 border-b ${applyTheme}`}>Create Event</Link>
            <Link href='/(auth)/logInPage' className={`my-5 border-b ${applyTheme}`}>Login</Link>
            <SignedIn>
                <SignOutButton />
            </SignedIn>
            <SignedOut>
                <Text className={`my-5 ${applyTheme}`}>Signed out</Text>
            </SignedOut>
            <Link href='/(dashboard)/camera' className={`my-5 border-b ${applyTheme}`}>Camera</Link>
        </View>
    )
}

export default Home
