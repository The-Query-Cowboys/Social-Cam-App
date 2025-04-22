import {Text, View} from 'react-native'
import {Link, useLocalSearchParams} from 'expo-router'
import React, {useEffect, useState} from 'react'
import {useTheme} from "@/context/ThemeContext";
import axios from "axios";

const event_id = () => {
    const {colorScheme} = useTheme()
    const {event_id} = useLocalSearchParams()
    console.log(event_id)
    const [event, setEvent] = useState(null)

    useEffect(() => {
        axios.get(`/api/events/${event_id}`).then(({data}) => setEvent(data))
        console.log(event)
    }, [event_id])

    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black' : 'text-black bg-white'}`


    return (
        <View className={`flex-1 items-center justify-center ${applyTheme}`}>
            <Text className={`text-xl font-bold mt-2 ${applyTheme}`}>*Event data here, waiting for access to the endpoint*</Text>

            <Link href='/' className={`my-2 border-b ${applyTheme}`}>Home</Link>
        </View>
    )
}

export default event_id
