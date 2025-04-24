import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { getUserEvents, getAlbumPictures } from "../api/api";
import { SafeAreaView, Text, ScrollView, View, FlatList } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import AlbumCard from "./albumCard";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Event {
  event_id: number;
  event_date_end: string;
  album_id: number;
  event_title: string;
  event_date: string;
}

interface AlbumData {
  pictures: Picture[];
}

interface Picture {
  album_id: number;
  picture_id: number;
  storage_id: string;
  type_id: number;
}

interface Album {
  album_id: number;
  album_name: string;
  storage_id?: string;
  picture_count: number;
  event_date: string;
  event_date_end: string;
  pictures: Picture[];
}
const AlbumList = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isDark } = useTheme();
  const { user } = useUser();

  const styles = {
    container: `flex-1 text-xl ${isDark ? "text-white" : "text-black"}`,
    header: `"p-4 mb-10 flex-row justify-between items-center border-b-2" ${
      isDark ? "text-white" : "text-black"
    }`,
    loadingContainer: "flex-1 justify-center items-center",
    errorText: `text-center p-4 ${isDark ? "text-white" : "text-black"}`,
    page: `flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`,
    homeLink: `font-bold ${
      isDark ? "text-foreground-dark" : "text-primary-light"
    }`,
    title: `text-xl font-bold ${
      isDark ? "text-foreground-dark" : "text-primary-light"
    }`,
    separator: `flex-row justify-between mb-4 px-4 pt-2 border-b-2 my-4 ${
      isDark ? "border-primary-dark" : "border-primary-light"
    }`,
  };

  const transformAlbumData = (
    albumsData: AlbumData[],
    userEvents: Event[]
  ): Album[] => {
    return albumsData
      .map((albumData) => {
        // Find matching event for this album
        const albumId = albumData.pictures[0]?.album_id;
        const matchingEvent = userEvents.find(
          (event) => event.album_id === albumId
        );

        if (!matchingEvent || albumData.pictures.length === 0) {
          return null;
        }
        return {
          album_id: albumId,
          album_name: matchingEvent.event_title,
          storage_id: albumData.pictures[0]?.storage_id,
          picture_count: albumData.pictures.length,
          event_date: matchingEvent.event_date,
          event_date_end: matchingEvent.event_date_end,
          pictures: albumData.pictures,
        };
      })
      .filter((album) => album !== null) as Album[]; // Remove any null entries
  };
  useEffect(() => {
    async function getUserAlbums() {
      if (user) {
        setIsLoading(true);
        setError(null);
        try {
          const userEvents = await getUserEvents(user.user_id);

          const date = new Date();
          const pastEvents = userEvents.filter(
            (event: Event) => new Date(event.event_date_end) < date
          );

          const albumIds = pastEvents.map((event: Event) => event.album_id);

          const albumsData = await Promise.all(
            albumIds.map(async (albumId: number) => {
              return await getAlbumPictures(albumId);
            })
          );
          const formattedAlbums = transformAlbumData(albumsData, pastEvents);
          setAlbums(formattedAlbums);
        } catch (err) {
          setError("Failed to load albums");
        } finally {
          setIsLoading(false);
        }
      }
    }

    getUserAlbums();
  }, [user]);

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`${styles.page}`}>
      <View className={`${styles.separator}`}>
        <Link href="/" className={`${styles.homeLink}`}>
          <Ionicons
            name="home-outline"
            size={24}
            color={isDark ? "#f65275" : "#1f2937"}
          />
        </Link>
        <Text className={`${styles.title} mb-6`}>Your Albums</Text>
      </View>
      {albums.length > 0 ? (
        <FlatList
          data={albums}
          keyExtractor={(item) => item.album_id.toString()}
          renderItem={({ item }) => <AlbumCard album={item} />}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text className={styles.container}>You don't have any albums yet</Text>
      )}
    </SafeAreaView>
  );
};

export default AlbumList;
