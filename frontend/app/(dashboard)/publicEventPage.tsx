import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { appwriteGetImageUrl } from "@/appwrite/appwrite.client";
import { getEvents, getUserEvents, getEventUsers } from "../../app/api/api";
import { useUser } from "../../context/UserContext";
import EventInvite from "../components/EventInvite";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import EventRSVP from "../components/EventRSVP";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const PublicEventPage = () => {
  const { user } = useUser();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [attendingUsers, setAttendingUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();

  // Grouped styles object
  const styles = {
    // Page level styles
    page: {
      container: `flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`,
      text: `${isDark ? "text-text-dark" : "text-text-light"}`,
    },

    // Header section
    header: {
      container: "p-4 flex-row justify-between items-center border-b",
      border: isDark ? "border-primary-dark" : "border-primary-light",
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

    // Event list section
    eventList: {
      container: "mt-4 mb-2",
      title: `text-xl font-bold mb-5 text-center ${
        isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
      emptyMessage: `text-lg font-medium text-center my-5 ${
        isDark ? "text-text-dark" : "text-text-light"
      }`,
      separator: `border-b-2 w-full my-4 ${
        isDark ? "border-pinkRed-700" : "border-pinkRed-500"
      }`,
    },

    // Event card in list
    eventCard: {
      container: "items-center justify-start mx-2 my-2",
      touchable: "rounded-lg overflow-hidden shadow-md",
      background: isDark ? "bg-surface-dark" : "bg-surface-light",
      imageContainer: "w-64 h-64 justify-center items-center overflow-hidden",
      image: "w-full h-full",
      title: `text-center font-bold py-3 px-4 ${
        isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
      selected: isDark
        ? "border-2 border-pinkRed-600"
        : "border-2 border-pinkRed-500",
    },

    // Event details
    eventDetails: {
      container: `px-8 py-4 rounded-lg mx-2 mb-8 ${
        isDark ? "bg-surface-dark" : "bg-surface-light"
      }`,
      header: "flex-row justify-between items-center mb-4",
      title: `text-xl font-bold mb-2 ${
        isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
      section: "mb-4",
      sectionTitle: `text-lg font-bold mb-1 ${
        isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
      description: `text-base mb-4 ${
        isDark ? "text-text-dark" : "text-text-light"
      }`,
      infoRow: "flex-row items-center mb-2",
      statsRow: "flex-row justify-between items-center mb-4",
      attendanceStats: "flex-row items-center",
      statCount: `font-bold text-base ${
        isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
      statLabel: `text-sm ${isDark ? "text-text-dark" : "text-text-light"}`,
      infoIcon: {
        size: 20,
        color: isDark ? "#f65275" : "#1f2937",
        marginRight: 8,
      },
      statIcon: {
        size: 22,
        color: isDark ? "#f65275" : "#1f2937",
        marginRight: 6,
      },
      infoText: `${isDark ? "text-text-dark" : "text-text-light"}`,
      divider: "h-px w-full my-3 bg-gray-300",
      actionBar: "w-full mb-4 mt-2",
    },

    // Loading state
    loading: {
      container: "flex-1 justify-center items-center",
      color: isDark ? "#f65275" : "#1f2937",
    },
  };

  useEffect(() => {
    setIsLoading(true);
    async function fetchEvents() {
      try {
        if (isPublic) {
          const data = await getEvents();
          const upcoming = data.filter((event) => {
            const eventDate = new Date(event.event_date);
            const today = new Date();

            return eventDate >= today;
          });
          setEvents(upcoming);
        } else if (user) {
          const userEvents = await getUserEvents(user.user_id, [1, 2]);
          const upcoming = userEvents.filter((event) => {
            const eventDate = new Date(event.event_date);
            const today = new Date();

            return eventDate >= today;
          });
          setEvents(upcoming);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [isPublic, user]);

  // Fetch event users when selectedEvent changes
  useEffect(() => {
    if (selectedEvent?.event_id) {
      const fetchEventUsers = async () => {
        try {
          const invitedUsers = await getEventUsers(
            selectedEvent.event_id,
            [1, 2]
          );
          const attendingUsers = await getEventUsers(selectedEvent.event_id, [
            2,
          ]);
          setAttendingUsers(attendingUsers);
          setInvitedUsers(invitedUsers);
        } catch (err) {
          console.error(err);
        }
      };

      fetchEventUsers();
    }
  }, [selectedEvent]);

  const togglePublic = () => {
    setIsPublic(!isPublic);
    setSelectedEvent(null); // Clear selection when toggling
  };

  const EventCard = ({ item, isSelected }) => {
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
      let isMounted = true;
      const serveImage = async () => {
        try {
          const image_url = await appwriteGetImageUrl(item.storage_id);
          if (typeof image_url === "string" && isMounted) {
            setImageURL(image_url);
          }
        } catch (error) {
          console.error("Error loading image:", error);
        }
      };
      serveImage();

      return () => {
        isMounted = false;
      };
    }, [item.storage_id]);

    return (
      <View className={styles.eventCard.container}>
        <TouchableOpacity
          className={`${styles.eventCard.touchable} ${
            styles.eventCard.background
          } ${isSelected ? styles.eventCard.selected : ""}`}
          onPress={() => setSelectedEvent(item)}
        >
          <Text className={styles.eventCard.title} numberOfLines={2}>
            {item.event_title}
          </Text>

          <View className={styles.eventCard.imageContainer}>
            {imageURL ? (
              <Image
                source={{ uri: imageURL }}
                className="w-full h-full"
                resizeMode="cover"
                key={item.storage_id}
              />
            ) : (
              <View className="items-center justify-center">
                <Ionicons
                  name="image-outline"
                  size={32}
                  color={isDark ? "#666" : "#ccc"}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <View className={styles.loading.container}>
        <ActivityIndicator size="large" color={styles.loading.color} />
      </View>
    );
  }

  return (
    <SafeAreaView className={styles.page.container}>
      {/* Header Section */}
      <View className={`${styles.header.container} ${styles.header.border}`}>
        <Link href="/" className={styles.header.homeLink}>
          <Ionicons
            name="home-outline"
            size={24}
            color={isDark ? "#f65275" : "#1f2937"}
          />
        </Link>

        <SignedIn>
          <View className={styles.header.tabContainer}>
            <TouchableOpacity
              onPress={togglePublic}
              className={`${styles.header.tab} ${
                isPublic ? styles.header.activeTab : styles.header.inactiveTab
              }`}
            >
              <Text
                className={
                  isPublic
                    ? styles.header.activeTabText
                    : styles.header.inactiveTabText
                }
              >
                Public
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePublic}
              className={`${styles.header.tab} ${
                !isPublic ? styles.header.activeTab : styles.header.inactiveTab
              }`}
            >
              <Text
                className={
                  !isPublic
                    ? styles.header.activeTabText
                    : styles.header.inactiveTabText
                }
              >
                My Events
              </Text>
            </TouchableOpacity>
          </View>
        </SignedIn>
        <SignedOut>
          <View style={{ width: 80 }} />
        </SignedOut>
        <Text className={styles.header.title}>Events</Text>
      </View>

      {/* Fixed Event List Section */}
      <View className={styles.eventList.container}>
        {events.length > 0 ? (
          <FlatList
            data={events}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <EventCard
                item={item}
                isSelected={selectedEvent?.event_id === item.event_id}
              />
            )}
            keyExtractor={(item) => item.event_id.toString()}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        ) : (
          <Text className={styles.eventList.emptyMessage}>
            {isPublic
              ? "No public events available"
              : "You don't have any scheduled events"}
          </Text>
        )}
      </View>

      {/* Pink Red Separator */}
      <View className={styles.eventList.separator} />

      {/* Scrollable Event Details Section */}
      <ScrollView className={`flex-1 ${styles.page.container}`}>
        {selectedEvent ? (
          <View className={styles.eventDetails.container}>
            {/* Action Bar */}
            <View className={styles.eventDetails.actionBar}>
              {user?.user_id === selectedEvent.event_owner_id ? (
                <EventInvite eventId={selectedEvent.event_id} />
              ) : (
                <SignedIn>
                  <EventRSVP eventId={selectedEvent.event_id} />
                </SignedIn>
              )}
            </View>

            {/* Event Title and Stats */}
            <View>
              <Text className={styles.eventDetails.title}>
                {selectedEvent.event_title}
              </Text>

              {/* Attendance stats */}
              <View className={styles.eventDetails.statsRow}>
                <View className={styles.eventDetails.attendanceStats}>
                  <Ionicons
                    name="mail"
                    size={styles.eventDetails.statIcon.size}
                    color={styles.eventDetails.statIcon.color}
                    style={{
                      marginRight: styles.eventDetails.statIcon.marginRight,
                    }}
                  />
                  <View>
                    <Text className={styles.eventDetails.statCount}>
                      {invitedUsers?.length || 0}
                    </Text>
                    {/*<Text className={styles.eventDetails.statLabel}>
                          Invited
                        </Text>*/}
                  </View>
                </View>
                <View className={styles.eventDetails.attendanceStats}>
                  <Ionicons
                    name="people"
                    size={styles.eventDetails.statIcon.size}
                    color={styles.eventDetails.statIcon.color}
                    style={{
                      marginRight: styles.eventDetails.statIcon.marginRight,
                    }}
                  />
                  <View>
                    <Text className={styles.eventDetails.statCount}>
                      {attendingUsers?.length || 0}
                    </Text>
                    {/* <Text className={styles.eventDetails.statLabel}>
                      Attending
                    </Text>*/}
                  </View>
                </View>
              </View>
            </View>

            {/* Event Description */}
            <View className={styles.eventDetails.section}>
              <Text className={styles.eventDetails.sectionTitle}>
                Description
              </Text>
              <Text className={styles.eventDetails.description}>
                {selectedEvent.event_description || "No description available"}
              </Text>
            </View>

            {/* Event Details */}
            <View className={styles.eventDetails.section}>
              <Text className={styles.eventDetails.sectionTitle}>Details</Text>

              <View className={styles.eventDetails.infoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={styles.eventDetails.infoIcon.size}
                  color={styles.eventDetails.infoIcon.color}
                  style={{
                    marginRight: styles.eventDetails.infoIcon.marginRight,
                  }}
                />
                <Text className={styles.eventDetails.infoText}>
                  From: {formatDate(selectedEvent.event_date)}
                </Text>
              </View>

              <View className={styles.eventDetails.infoRow}>
                <Ionicons
                  name="time-outline"
                  size={styles.eventDetails.infoIcon.size}
                  color={styles.eventDetails.infoIcon.color}
                  style={{
                    marginRight: styles.eventDetails.infoIcon.marginRight,
                  }}
                />
                <Text className={styles.eventDetails.infoText}>
                  To: {formatDate(selectedEvent.event_date_end)}
                </Text>
              </View>

              <View className={styles.eventDetails.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={styles.eventDetails.infoIcon.size}
                  color={styles.eventDetails.infoIcon.color}
                  style={{
                    marginRight: styles.eventDetails.infoIcon.marginRight,
                  }}
                />
                <Text className={styles.eventDetails.infoText}>
                  {selectedEvent.event_location || "No location specified"}
                </Text>
              </View>
            </View>

            <View className={styles.eventDetails.divider} />
          </View>
        ) : (
          <View className="p-10 items-center">
            <Text className={`text-center ${styles.page.text}`}>
              Select an event to view details
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PublicEventPage;
