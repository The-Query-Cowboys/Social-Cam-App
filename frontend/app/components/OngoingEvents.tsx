import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { getUserEvents } from "@/app/api/api";
import { appwriteGetImageUrl } from "@/appwrite/appwrite.api";
import { Ionicons } from "@expo/vector-icons";

interface Event {
  event_id: number;
  event_title: string;
  event_description: string;
  event_date: string;
  event_date_end: string;
  storage_id: string;
  event_location: string;
}

interface EventItemProps {
  item: Event;
  isDark: boolean;
  styles: any;
}

const EventItem = ({ item, isDark, styles }: EventItemProps) => {
  const [imageURL, setImageURL] = useState<string | null>(null);

  // Load event image
  useEffect(() => {
    const loadImage = async () => {
      try {
        const image_url = await appwriteGetImageUrl(item.storage_id);
        if (typeof image_url === "string") {
          setImageURL(image_url);
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    loadImage();
  }, [item.storage_id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <View className={styles.eventCard.container}>
      <View className={styles.eventCard.row}>
        <View className={styles.eventCard.imageContainer}>
          {imageURL ? (
            <Image
              source={{ uri: imageURL }}
              className={styles.eventCard.image}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={32} color="#ccc" />
          )}
        </View>

        {/* Event Details */}
        <View className={styles.eventCard.content}>
          <View>
            <Text className={styles.eventCard.title} numberOfLines={1}>
              {item.event_title}
            </Text>

            <View className={styles.eventCard.detailsRow}>
              <Ionicons
                name="time-outline"
                size={16}
                color={styles.eventCard.icon.color}
                style={{ marginRight: styles.eventCard.icon.marginRight }}
              />
              <Text className={styles.eventCard.detailText}>
                Until {formatDate(item.event_date_end)}
              </Text>
            </View>

            <View className={styles.eventCard.detailsRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={styles.eventCard.icon.color}
                style={{ marginRight: styles.eventCard.icon.marginRight }}
              />
              <Text className={styles.eventCard.detailText} numberOfLines={1}>
                {item.event_location}
              </Text>
            </View>

            <View className={styles.eventCard.badge}>
              <Text className={styles.eventCard.badgeText}>HAPPENING NOW</Text>
            </View>
          </View>

          <Link href={`/camera/${item.event_id}`} asChild>
            <TouchableOpacity className={styles.eventCard.cameraButton}>
              <Ionicons
                name="camera"
                size={18}
                color={isDark ? "#101820" : "white"}
                style={{ marginRight: 6 }}
              />
              <Text className={styles.eventCard.buttonText}>Take Photo</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};

const OngoingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { isDark } = useTheme();

  const styles = {
    container: `flex-1 ${
      isDark ? "bg-background-dark" : "bg-background-light"
    }`,
    header: {
      container: `flex-row justify-between mb-4 px-4 pt-2 border-b ${
        isDark
          ? "border-primary-dark text-white"
          : "border-primary-light text-black"
      }`,
      border: `border-b-2 my-4 ${
        isDark ? "border-primary-dark" : "border-primary-light"
      }`,
      title: `text-xl font-bold ${
        isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
      homeLink: `py-2 font-bold ${
        isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
      tabContainer: "flex-row rounded-lg overflow-hidden",
      tab: `py-2 px-4`,
      activeTab: isDark ? "bg-primary-dark" : "bg-surface-light",
      inactiveTab: isDark ? "bg-gray-700" : "bg-gray-200",
      activeTabText: isDark
        ? "text-background-dark font-bold"
        : "text-foreground-light font-bold",
      inactiveTabText: isDark ? "text-gray-300" : "text-gray-600",
    },
    emptyMessage: `text-center p-4 ${
      isDark ? "text-text-dark" : "text-text-light"
    }`,
    loadingContainer: "flex-1 justify-center items-center",
    loadingColor: isDark ? "#f65275" : "#1f2937",
    errorText: `text-center text-pinkRed-600 p-4`,

    eventCard: {
      container: `mb-4 rounded-lg overflow-hidden border ${
        isDark
          ? "bg-surface-dark border-primary-dark"
          : "bg-surface-light border-gray-300"
      }`,
      row: "flex-row",
      imageContainer: "w-24 h-24 justify-left items-center bg-gray-200",
      image: "w-full h-full",
      content: "flex-1 p-3 justify-between",
      title: `font-bold text-lg ${
        isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
      detailsRow: "flex-row items-center mt-1",
      detailText: `text-sm ${isDark ? "text-text-dark" : "text-text-light"}`,
      icon: {
        marginRight: 4,
        color: isDark ? "#f65275" : "#1f2937",
      },
      badge: `px-2 py-1 rounded-full mt-1 self-start ${
        isDark ? "bg-neonGreen-700" : "bg-neonGreen-500"
      }`,
      badgeText: "text-white text-xs font-bold",
      cameraButton: `mt-2 py-2 px-4 rounded-lg self-start flex-row items-center ${
        isDark ? "bg-secondary-dark" : "bg-secondary-light"
      }`,
      buttonText: `font-medium ${
        isDark ? "text-background-dark" : "text-foreground-light"
      }`,
    },
    homeLink: `font-bold ${
      isDark ? "text-foreground-dark" : "text-primary-light"
    }`,
    title: `text-xl font-bold ${
      isDark ? "text-foreground-dark" : "text-primary-light"
    }`,
    separator: `border-b-2 my-4 ${
      isDark ? "border-pinkRed-700" : "border-pinkRed-500"
    }`,
  };

  useEffect(() => {
    const fetchOngoingEvents = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const userEvents = await getUserEvents(user.user_id, [2]);

        const now = new Date();
        const ongoingEvents = userEvents.filter((event: Event) => {
          const startDate = new Date(event.event_date);
          const endDate = new Date(event.event_date_end);
          return startDate <= now && now <= endDate;
        });

        setEvents(ongoingEvents);
      } catch (err) {
        console.error("Failed to fetch ongoing events:", err);
        setError("Failed to load ongoing events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOngoingEvents();
  }, [user]);

  const renderEventItem = ({ item }: { item: Event }) => {
    return <EventItem item={item} isDark={isDark} styles={styles} />;
  };

  if (isLoading) {
    return (
      <View className={styles.loadingContainer}>
        <ActivityIndicator size="large" color={styles.loadingColor} />
      </View>
    );
  }

  return (
    <SafeAreaView className={styles.container}>
      <View className={styles.header.container}>
        <Link href="/" className={styles.homeLink}>
          <Ionicons
            name="home-outline"
            size={24}
            color={isDark ? "#f65275" : "#1f2937"}
          />
        </Link>
        <Text className={`${styles.title} mb-6`}>Live Events</Text>
      </View>

      {error ? (
        <Text className={styles.errorText}>{error}</Text>
      ) : events.length > 0 ? (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.event_id.toString()}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text className={styles.emptyMessage}>
          You don't have any events happening right now.
        </Text>
      )}
    </SafeAreaView>
  );
};

export default OngoingEvents;
