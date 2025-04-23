<<<<<<< HEAD
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import { appwriteGetImageUrl } from "@/appwrite/appwrite.client";
import { getEvents, getUserEvents, getEventById } from "@/app/api/api";
import { useUser } from "../../context/UserContext";
=======
import { FlatList, SafeAreaView, Text, View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTheme } from "@/context/ThemeContext";
import axios from 'axios'
import {appwriteGetImageUrl} from "@/appwrite/appwrite.client";
import {getEvents} from "@/app/api/api";
>>>>>>> 0ae61a9d52e5efe9da058056b6276403ebbc6247

const { width } = Dimensions.get("window");

const PublicEventPage = () => {
<<<<<<< HEAD
  const { user } = useUser();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [events, setEvents] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isDark } = useTheme();
  const applyTheme = `${
    isDark
      ? "text-text-dark bg-background-dark"
      : "text-text-light bg-background-light"
  }`;

  useEffect(() => {
    setIsLoading(true);
    async function fetchEvents() {
      if (isPublic) {
        console.log("loading public");
        getEvents(isPublic).then((data) => {
          setEvents(data);
        });
      } else {
        const userEvents = await getUserEvents(user.user_id, [1, 2]);

        setEvents(userEvents);
      }
    }
    try {
      fetchEvents();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isPublic, user]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const togglePublic = () => {
    const bool = isPublic ? false : true;
    setIsPublic(bool);
  };

  const Event = ({
    event_title,
    event_date,
    event_date_end,
    event_location,
    storage_id,
    event_description,
  }: any) => {
    const [imageURL, setImageURL] = useState<string | null>(null);

    useEffect(() => {
      const serveImage = async () => {
        const image_url = await appwriteGetImageUrl(storage_id);
        setImageURL(image_url);
      };
      serveImage();
    }, [storage_id]);
=======
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
    const [events, setEvents] = useState(null)
    const { colorScheme } = useTheme()
    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black' : 'text-black bg-white'}`

    useEffect(() => {
        getEvents(true)
            .then((data) => {
                setEvents(data)
            })
    }, [])

    if (!events) {
        return <Text>Loading...</Text>
    }

    const Event = ({ event_id, event_title, event_date, event_date_end, event_location, storage_id, event_description }: any) => {
        const [imageURL, setImageURL] = useState<string | null>(null)

        useEffect(() => {
            const serveImage = async () => {
                const image_url = await appwriteGetImageUrl(storage_id)

                if (typeof image_url === "string") {
                    setImageURL(image_url)
                }
            }
            serveImage()
        }, [storage_id]);

        return (
            <View style={{ width: width, marginHorizontal: 10 }}>
                <TouchableOpacity className={`flex-1 items-center my-10 ${applyTheme}`} onPress={() => setSelectedEvent({ event_title, event_description })}>
                    <Text className={`text-xl ${applyTheme}`}>
                        {event_title}
                    </Text>
                    {/* Fixed size image container */}
                    <View style={{ height: 250, width: '100%' }}>
                        {imageURL &&
                            <Image
                                source={{ uri: imageURL }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="contain"
                            />}
                    </View>
                    <Text className={`text-center ${applyTheme} `}>
                        Start: {event_date.slice(0, 10)} at {event_date.slice(11, 16)}{'\n'}
                        End: {event_date_end.slice(0, 10)} at {event_date_end.slice(11, 16)}{'\n'}
                        Location: {event_location}
                    </Text>
                    <Text className={`${applyTheme}`}>
                        Click to learn more
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
>>>>>>> 0ae61a9d52e5efe9da058056b6276403ebbc6247

    return (
      <View style={{ width: width, marginHorizontal: 10 }}>
        <TouchableOpacity
          className={`flex-1 items-center my-10 ${applyTheme}`}
          onPress={() => setSelectedEvent({ event_title, event_description })}
        >
          <Text className={`text-xl ${applyTheme}`}>{event_title}</Text>
          {/* Fixed size image container */}
          <View style={{ height: 250, width: "100%" }}>
            {imageURL && (
              <Image
                source={{ uri: imageURL }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            )}
          </View>
          <Text className={`text-center ${applyTheme} `}>
            Start: {event_date.slice(0, 10)} at {event_date.slice(11, 16)}
            {"\n"}
            End: {event_date_end.slice(0, 10)} at {event_date_end.slice(11, 16)}
            {"\n"}
            Location: {event_location}
          </Text>
          <Text className={`${applyTheme}`}>Click to learn more</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${applyTheme}`}>
      <TouchableOpacity onPress={togglePublic} className={`${applyTheme}`}>
        <Text>{isPublic ? "Public Events" : "Invited Events"}</Text>
      </TouchableOpacity>
      <ScrollView className={`flex-1 ${applyTheme}`}>
        <View className="p-4 border-b border-gray-300">
          <Link href="/" className={`py-2 px-4 font-bold ${applyTheme}`}>
            Home
          </Link>
        </View>

<<<<<<< HEAD
        <View className={`items-center justify-center ${applyTheme}`}>
          <Text className={`text-xl font-bold mb-5 mt-2 ${applyTheme}`}>
            Events
          </Text>

          <FlatList
            data={events}
            horizontal={true}
            decelerationRate="normal"
            renderItem={({ item }) => (
              <Event
                event_title={item.event_title}
                event_location={item.event_location}
                event_date={item.event_date}
                event_date_end={item.event_date_end}
                storage_id={item.storage_id}
                event_description={item.event_description}
              />
            )}
          />
=======
                    <FlatList
                        data={events}
                        horizontal={true}
                        decelerationRate="normal"
                        renderItem={
                            ({ item }) =>
                                <Event
                                    event_id={item.event_id}
                                    event_title={item.event_title}
                                    event_location={item.event_location}
                                    event_date={item.event_date}
                                    event_date_end={item.event_date_end}
                                    storage_id={item.storage_id}
                                    event_description={item.event_description}
                                />}
                    />

                    {selectedEvent && (
                        <View className={`mx-5 mb-10 ${applyTheme}`} style={{ width: '90%', paddingBottom: 20 }}>
                            <Text className={`text-xl font-bold ${applyTheme}`}>{selectedEvent.event_title}</Text>
                            <ScrollView>
                                <Text className={`text-lg ${applyTheme}`}>Description: {selectedEvent.event_description}</Text>
                            </ScrollView>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
>>>>>>> 0ae61a9d52e5efe9da058056b6276403ebbc6247

          {selectedEvent && (
            <View
              className={`mx-5 mb-10 ${applyTheme}`}
              style={{ width: "90%", paddingBottom: 20 }}
            >
              <Text className={`text-xl font-bold ${applyTheme}`}>
                {selectedEvent.event_title}
              </Text>
              <ScrollView>
                <Text className={`text-lg ${applyTheme}`}>
                  Description: {selectedEvent.event_description}
                </Text>
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PublicEventPage;
