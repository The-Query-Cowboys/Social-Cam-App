//Click on 'INVITE TO EVENT' button
//brings to this page with a form
//write in username/email
//sends api call to invite that user

//should be a button with a +user svg

import { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native";

import { useUser } from "../../context/UserContext";
import { getUserByUsername, inviteToEvent } from "../api/api";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const EventInvite = ({ eventId }) => {
  const [username, setUsername] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { isDark } = useTheme();

  const inputRef = useRef(null);
  console.log(inputRef);

  //   const bgColor = isDark ? "bg-primary-dark" : "bg-primary-light";
  //   const borderColor = isDark
  //     ? "border-secondary-dark"
  //     : "border-secondary-light";

  //   const styles = {
  //     inviteButton: "flex-row items-center py-2 px-4 rounded-full",
  //     inviteCol: isDark ? "bg-background-dark" : "bg-background-light",
  //     modalContainer: `m-5 p-5 rounded-lg ${bgColor} border ${borderColor} w-4/5`,
  //   };

  const styles = {
    inviteButton: {
      container: `flex-row items-center py-2 px-4 rounded-full self-start ${
        isDark ? "bg-secondary-dark" : "bg-secondary-light"
      }`,
      text: `font-medium ${
        isDark ? "text-background-dark" : "text-foreground-light"
      }`,
      icon: {
        color: isDark ? "#101820" : "white",
        size: 20,
        className: "mr-2",
      },
    },

    modal: {
      overlay: "flex-1 justify-center items-center",
      container: `mx-6 p-6 rounded-lg w-full max-w-md shadow-lg ${
        isDark ? "bg-surface-dark" : "bg-surface-light"
      }`,
    },

    header: {
      container: "flex-row justify-between items-center mb-4",
      title: `text-xl font-bold ${
        isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
      closeButton: "p-1",
      closeIcon: {
        color: isDark ? "#f65275" : "#1f2937",
        size: 28,
      },
    },

    inputField: {
      container: `mb-4 border rounded-lg overflow-hidden ${
        error
          ? "border-pinkRed-600"
          : isDark
          ? "border-primary-dark"
          : "border-primary-light"
      }`,
      input: `px-4 py-3 ${
        isDark
          ? "text-text-dark bg-background-dark"
          : "text-text-light bg-white"
      }`,
      placeholderColor: isDark ? "#999" : "#666",
    },

    message: {
      container: "mb-4 px-2",
      error: "text-pinkRed-600 text-sm",
      success: {
        container: "mb-4 px-2 flex-row items-center",
        icon: {
          size: 18,
          color: isDark ? "#aadb1e" : "#4ECDC4",
        },
        text: `ml-2 ${isDark ? "text-neonGreen-500" : "text-secondary-light"}`,
      },
    },

    actionButton: {
      container: `py-3 px-4 rounded-lg items-center ${
        isLoading || success || !username.trim()
          ? isDark
            ? "bg-gray-700"
            : "bg-gray-300"
          : isDark
          ? "bg-secondary-dark"
          : "bg-secondary-light"
      }`,
      text: `font-bold ${isDark ? "text-background-dark" : "text-white"}`,
      loadingIndicatorColor: isDark ? "#101820" : "white",
    },
  };

  useEffect(() => {
    if (showInvite && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInvite]);

  useEffect(() => {
    if (!showInvite) {
      setError(null);
      setSuccess(false);
    }
  }, [showInvite]);
  const handleInvite = async () => {
    {
      if (!username.trim()) {
        setError("Please enter a username");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const user = await getUserByUsername(username);
        await inviteToEvent(eventId, user.user_id);
        setSuccess(true);
        setUsername("");
        setShowInvite(false);
      } catch (err) {
        setError(err.response?.data?.message || "User not found");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => setShowInvite(true)}
        className={`${styles.inviteButton.container}`}
      >
        <Ionicons
          name="person-add"
          size={styles.inviteButton.icon.size}
          color={styles.inviteButton.icon.color}
          className={styles.inviteButton.icon.className}
        />
        <Text className={styles.inviteButton.text}>Invite a User</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showInvite}
        onRequestClose={() => setShowInvite(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className={styles.modal.overlay}
        >
          <View className={styles.modal.container}>
            <View className={styles.header.container}>
              <Text className={styles.header.title}>Invite User</Text>
              <TouchableOpacity onPress={() => setShowInvite(false)}>
                <Ionicons
                  name="close"
                  size={styles.header.closeIcon.size}
                  color={styles.header.closeIcon.color}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              className={styles.inputField.input}
              ref={inputRef}
              placeholder="Enter username"
              placeholderTextColor={styles.inputField.placeholderColor}
              value={username}
              onChangeText={(username) => setUsername(username)}
              autoCapitalize="none"
              editable={!isLoading && !success}
            />
            {error && (
              <View className={styles.message.container}>
                <Text className={styles.message.error}>{error}</Text>
              </View>
            )}
            {success && (
              <View className={styles.message.success.container}>
                <Ionicons
                  name="checkmark"
                  size={styles.message.success.icon.size}
                  color={styles.message.success.icon.color}
                />
                <Text className={styles.message.success.text}>
                  Invitation sent successfully!
                </Text>
              </View>
            )}
            <View>
              <TouchableOpacity
                onPress={handleInvite}
                disabled={isLoading}
                className={styles.actionButton.container}
              >
                {isLoading ? (
                  <ActivityIndicator
                    color={styles.actionButton.loadingIndicatorColor}
                  />
                ) : (
                  <Text className={styles.actionButton.text}>
                    {success ? "Invite Sent!" : "Send Invite"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};
export default EventInvite;
