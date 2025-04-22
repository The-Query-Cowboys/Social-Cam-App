import React from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

interface Album {
  album_id: number;
  album_name: string;
  storage_id?: string;
  picture_count: number;
  event_date: string;
  event_date_end: string;
  pictures: Picture[];
}

interface Picture {
  album_id: number;
  picture_id: number;
  storage_id: string;
  type_id: number;
}

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const { isDark } = useTheme();

  console.log("rendering album card");
  // Define styles object with class names
  const styles = {
    card: `mb-4 rounded-xl overflow-hidden ${
      isDark ? "bg-gray-800" : "bg-white"
    } ${
      Platform.OS === "ios"
        ? "shadow-md shadow-black/10"
        : "shadow-md shadow-black/10 android:elevation-3"
    }`,
    container: "flex-row",
    image: "w-24 h-24 rounded-l-xl",
    contentContainer: "p-3 flex-1 justify-between",
    titleContainer: "",
    title: `font-bold text-lg mb-1 ${isDark ? "text-white" : "text-black"}`,
    date: `text-xs mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`,
    photoCount: `text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`,
  };

  // need to implement appwrite
  const imageSource = album.storage_id
    ? require("@/assets/icon.png")
    : require("@/assets/icon.png");

  return (
    <Link href={`/album/${album.album_id}`} asChild>
      <TouchableOpacity activeOpacity={0.7} className={styles.card}>
        <View className={styles.container}>
          <Image
            source={imageSource}
            className={styles.image}
            resizeMode="cover"
          />
          <View className={styles.contentContainer}>
            <View className={styles.titleContainer}>
              <Text className={styles.title} numberOfLines={1}>
                {album.album_name}
              </Text>

              {album.event_date && (
                <Text className={styles.date}>
                  {new Date(album.event_date).toLocaleDateString()}
                </Text>
              )}
            </View>

            {album.picture_count !== undefined && (
              <Text className={styles.photoCount}>
                {album.picture_count}{" "}
                {album.picture_count === 1 ? "photo" : "photos"}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default AlbumCard;
