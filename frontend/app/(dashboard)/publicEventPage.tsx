import {FlatList, SafeAreaView, Text, View, Image, TouchableOpacity} from 'react-native'
import {Link} from 'expo-router'
import {useEffect, useState} from 'react'
import {useTheme} from "@/context/ThemeContext";
import axios from 'axios'
import {SafeAreaProvider} from "react-native-safe-area-context";
import icon from '../../assets/favicon.png'

const PublicEventPage = () => {
    const [events, setEvents] = useState(null)

    useEffect(() => {
        axios.get('https://social-cam-app-api.onrender.com/api/events')
            .then((response) => {
                setEvents(response.data)
            })
    }, [])

    const {colorScheme} = useTheme()

    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black' : 'text-black bg-white'}`

    if (!events) {
        return <Text>Loading...</Text>
    }

    type EventsProps = {
        event_date: string,
        event_date_end: string,
        event_description: string,
        event_location: string,
        event_title: string
    }

    const Event = ({event_date, event_date_end, event_description, event_location, event_title} : EventsProps) => {
        return (
        <View>
            <TouchableOpacity className={`flex-1 items-center mb-10 ${applyTheme}`}>
                <Text className={`text-xl ${applyTheme}`}>
                    {event_title}
                </Text>
                <Image source={icon} className={'m-5'}/>
                <Text className={`text-center ${applyTheme} `}>
                    Start: {event_date.slice(0,10)} at {event_date.slice(11, 16)}{'\n'}
                    End: {event_date_end.slice(0,10)} at {event_date_end.slice(11, 16)}{'\n'}
                    Location: {event_location}
                </Text>
                <Text className={`m-5 ${applyTheme}`}>
                    Description: {event_description}
                </Text>
            </TouchableOpacity>
        </View>
        )
    }

    return (
        <View className={`flex-1 items-center justify-center ${applyTheme}`}>
            <Link href='/' className={`my-5 border-b font-bold ${applyTheme}`}>Home</Link>
            <Text className={`text-xl font-bold mb-5 ${applyTheme}`}>Events</Text>
            <SafeAreaView>
                <SafeAreaProvider>
                    <FlatList data={events}
                              contentContainerStyle={{paddingBottom: '10%'}}
                              renderItem={
                                    ({item}) =>
                                  <Event event_title={item.event_title} event_location={item.event_location}
                                         event_description={item.event_description} event_date={item.event_date} event_date_end={item.event_date_end}/>}
                    />
                </SafeAreaProvider>
            </SafeAreaView>
        </View>
    )
}

export default PublicEventPage

