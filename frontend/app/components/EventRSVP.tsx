import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUser } from "../../context/UserContext";
import {
  updateUserEventStatus,
  deleteUserEvent,
  getUserEventStatus,
} from "../api/api";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const EventRSVP = ({ eventId }) => {
  const [status, setStatus] = useState(1); // Default to "invited" status
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { user } = useUser();
  const { isDark } = useTheme();

  // Fetch the current user event status when component mounts
  useEffect(() => {
    async function getStatus() {
      try {
        console.log(user.user_id, eventId, "<-- user id and event id");
        const currStatus = await getUserEventStatus(eventId, user.user_id);
        console.log(currStatus);
        setStatus(currStatus);
      } catch (error) {
        console.error("Failed to get event status:", error);
      }
    }

    if (user && eventId) {
      getStatus();
    }
  }, [user, eventId]);

  // Hide success message after 3 seconds
  useEffect(() => {
    let timer;
    if (showMessage) {
      timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showMessage]);

  const handleUserStatusChange = async () => {
    // Toggle between invited (1) and attending (2)
    const newStatus = status === 1 ? 2 : 1;
    console.log("changing user event status");
    setIsLoading(true);

    try {
      await updateUserEventStatus(eventId, user.user_id, newStatus);
      setStatus(newStatus);

      // Show success message when attending
      if (newStatus === 2) {
        setShowMessage(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update attendance status");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserEventRemoval = async () => {
    console.log("called");
    Alert.alert(
      "Remove Event",
      "Are you sure you want to remove this event from your list?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteUserEvent(eventId, user.user_id);
            } catch (error) {
              Alert.alert("Error", "Failed to remove event");
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Define styles based on theme
  const textColor = isDark ? "text-white" : "text-gray-800";
  const bgAttending = isDark ? "bg-neonGreen-700" : "bg-neonGreen-500";
  const bgInvited = isDark ? "bg-deepBlue-700" : "bg-deepBlue-500";
  const bgDelete = isDark ? "bg-pinkRed-700" : "bg-pinkRed-500";

  const messageStyles = {
    container: `absolute top-2 left-0 right-0 p-3 rounded-lg mx-4 z-10 
                ${isDark ? "bg-neonGreen-700" : "bg-neonGreen-500"} 
                ${showMessage ? "opacity-100" : "opacity-0"}`,
    text: "text-white text-center font-bold",
    icon: { marginRight: 6 },
  };

  return (
    <SafeAreaView>
      {/* Success message */}
      {showMessage && (
        <View className={messageStyles.container}>
          <View className="flex-row items-center justify-center">
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="white"
              style={messageStyles.icon}
            />
            <Text className={messageStyles.text}>
              You're now attending this event!
            </Text>
          </View>
        </View>
      )}

      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity
          onPress={handleUserEventRemoval}
          disabled={isLoading}
          className={`p-2 rounded-full ${bgDelete} ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>

        {/*<Text className={`${textColor} mx-2 flex-1 text-center`}>
          {status === 1 ? "You're invited" : "You're attending"}
        </Text>*/}

        <TouchableOpacity
          onPress={handleUserStatusChange}
          disabled={isLoading}
          className={`p-2 rounded-full ${
            status === 1 ? bgInvited : bgAttending
          } ${isLoading ? "opacity-50" : ""}`}
        >
          <Ionicons
            name={status === 1 ? "checkmark" : "close-circle-outline"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EventRSVP;
