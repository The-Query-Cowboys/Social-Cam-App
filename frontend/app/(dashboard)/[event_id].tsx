import {Text, View} from 'react-native'
import {Link, useLocalSearchParams} from 'expo-router'
import React, {useEffect, useState} from 'react'
import {useTheme} from "@/context/ThemeContext";
import axios from "axios";

const Event_id = () => {
    const {colorScheme} = useTheme()
    const {event_id} = useLocalSearchParams()
    console.log(event_id)
    const [event, setEvent] = useState<any | null>(null);

    useEffect(() => {
        if (event_id) {
            axios.get(`https://social-cam-app-api.onrender.com/api/events/${event_id}`)
                .then(({data}) => setEvent(data))
        }
    }, [event_id])

    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black' : 'text-black bg-white'}`

    if (!event) {
        return (
            <View className={`flex-1 items-center justify-center ${applyTheme}`}>
                <Text className={`text-xl font-bold mt-2 ${applyTheme}`}>Loading event details...</Text>
            </View>
        );
    }

    return (
        <View className={`flex-1 items-center justify-center ${applyTheme}`}>
            <Text className={`text-xl font-bold mt-2 ${applyTheme}`}>{event.event_title}</Text>

            <Link href='/' className={`my-2 border-b ${applyTheme}`}>Home</Link>
        </View>
    )
}

export default Event_id
