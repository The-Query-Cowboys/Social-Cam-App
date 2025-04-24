import { Text, SafeAreaView, View, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useTheme } from "@/context/ThemeContext";
import { getAlbumPictures } from '../api/api';
import { appwriteGetImageUrl } from '@/appwrite/appwrite.api';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Swiper from 'react-native-swiper'
import {Ionicons} from "@expo/vector-icons";

interface PictureProps {
    album_id: number;
    picture_id: number;
    storage_id: string;
    type_id: number;
    url: string;
}

const album_id = () => {

    const { colorScheme } = useTheme()
    const { albumId } = useLocalSearchParams()
    const [pictures, setPictures] = useState<PictureProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { isDark } = useTheme();

    const styles = {
        container: `flex-1 text-xl ${isDark ? "text-white" : "text-black"}`,
        header: `"p-4 mb-10 flex-row justify-between items-center border-b" ${isDark ? "text-white" : "text-black"}`,
        loadingContainer: "flex-1 justify-center items-center",
        errorText: `text-center p-4 ${isDark ? "text-white" : "text-black"}`,
        page: `flex-1 ${
            isDark ? "bg-background-dark" : "bg-background-light"
        }`,
        homeLink: `font-bold ${
            isDark ? "text-foreground-dark" : "text-primary-light"
        }`,
        title: `text-xl font-bold ${
            isDark ? "text-foreground-dark" : "text-primary-light"
        }`,
        separator: `border-b-2 my-4 ${
            isDark ? "border-pinkRed-700" : "border-pinkRed-500"
        }`
      };

    useEffect(() => {
        setIsLoading(true);
        getAlbumPictures(Number(albumId))
            .then(({ pictures }) => {
                setError("");
                if (pictures.length > 0) {
                    setPictures(pictures)
                }
                return pictures
            })
            .then((pictures) => {
                pictures.forEach(async (image: any) => {
                    const imageUrl = await appwriteGetImageUrl(image.storage_id)
                    image.url = imageUrl
                })

                setIsLoading(false);
            })
            .catch((err) => {
                setError("Failed to load albums");
            })
    }, [])


    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black' : 'text-black bg-white'}`

    if (isLoading) {
        return (
            <SafeAreaView className={`flex-1 items-center justify-center ${applyTheme}`}>
                <Text className={`text-xl font-bold mt-2 ${applyTheme}`}>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className={`flex-1 items-center justify-center ${applyTheme}`}>
                <Text className={`text-xl font-bold mt-2 ${applyTheme}`}>{error}</Text>
            </SafeAreaView>
        );
    }

    const stylesSlider = StyleSheet.create({
        wrapper: {
            height: 300,
        },
        slide: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        image: {
            height: '40%',
            width: '85%',
        }
    })

    return (
        <SafeAreaView className={`${styles.page}`}>
            <View className={`flex-row justify-between mb-4 px-4 pt-2 ${styles.separator}`}>
                <Link href="/" className={`${styles.homeLink}`}>
                    <Ionicons
                        name="home-outline"
                        size={24}
                        color={isDark ? "#f65275" : "#1f2937"}
                    />
                </Link>
                <Text className={`${styles.title} mb-6`}>Album Pictures</Text>
                <View />
            </View>
            <Swiper
                style={stylesSlider.wrapper}
                showsButtons={true}
                loop={true}
            >
                {
                    pictures.map((picture) => (
                        <View key={picture.picture_id} style={stylesSlider.slide}>
                            <Image source={{ uri: picture.url }} style={stylesSlider.image} />
                        </View>
                    ))
                }
            </Swiper>
        </SafeAreaView>
    )

    //if prefer scroll down and up
    // const Picture = ({ storage_id }: PictureProps) => {
    //     const [imageURL, setImageURL] = useState<string | undefined>(undefined)
    //     useEffect(() => {
    //         const serveImage = async () => {
    //             const image_url = await appwriteGetImageUrl(storage_id)
    //             if (typeof image_url === "string") {
    //                 setImageURL(image_url)
    //             }
    //         }
    //         serveImage()
    //     }, [storage_id]);
    //     return (
    //         <View>
    //             <TouchableOpacity className={`flex-1 items-center mb-10 ${applyTheme}`}>
    //                 {imageURL &&
    //                     <Image source={{ uri: imageURL }} className={`w-100 h-80`} />}
    //             </TouchableOpacity>
    //         </View>
    //     )
    // }

    // return (
    //     <View className={`flex-1 items-center justify-center ${applyTheme}`}>
    //         <Link href='/' className={`my-5 border-b font-bold ${applyTheme}`}>Home</Link>
    //         <Text className={`text-xl font-bold mb-5 ${applyTheme}`}>Album List</Text>
    //         <SafeAreaView>
    //             <SafeAreaProvider>
    //                 <FlatList data={pictures}
    //                     contentContainerStyle={{ paddingBottom: '10%' }}
    //                     renderItem={
    //                         ({ item }) =>
    //                             <Picture
    //                                 album_id={item.album_id}
    //                                 picture_id={item.picture_id}
    //                                 storage_id={item.storage_id}
    //                                 type_id={item.type_id}
    //                                 url={item.url}
    //                             />}
    //                 />
    //             </SafeAreaProvider>
    //         </SafeAreaView>
    //     </View>
    // )
}

export default album_id