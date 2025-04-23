import { Text, SafeAreaView, View, Image, TouchableOpacity, FlatList } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useTheme } from "@/context/ThemeContext";
import { getAlbumPictures } from '../api/api';
import { appwriteGetImageUrl } from '@/appwrite/appwrite.api';
import { SafeAreaProvider } from "react-native-safe-area-context";
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
    useEffect(() => {
        setIsLoading(true);
        getAlbumPictures(Number(albumId))
            .then(({ pictures }) => {
                setIsLoading(false);
                setError("");
                if (pictures) {
                    setPictures(pictures)
                }
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
    const Picture = ({ storage_id }: PictureProps) => {
        const [imageURL, setImageURL] = useState<string | undefined>(undefined)
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
            <View>
                <TouchableOpacity className={`flex-1 items-center mb-10 ${applyTheme}`}>
                    {imageURL &&
                        <Image source={{ uri: imageURL }} className={`w-100 h-80`} />}
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View className={`flex-1 items-center justify-center ${applyTheme}`}>
            <Link href='/' className={`my-5 border-b font-bold ${applyTheme}`}>Home</Link>
            <Text className={`text-xl font-bold mb-5 ${applyTheme}`}>Album List</Text>
            <SafeAreaView>
                <SafeAreaProvider>
                    <FlatList data={pictures}
                        contentContainerStyle={{ paddingBottom: '10%' }}
                        renderItem={
                            ({ item }) =>
                                <Picture
                                    album_id={item.album_id}
                                    picture_id={item.picture_id}
                                    storage_id={item.storage_id}
                                    type_id={item.type_id}
                                    url={item.url}
                                />}
                    />
                </SafeAreaProvider>
            </SafeAreaView>
        </View>
    )
}
export default album_id