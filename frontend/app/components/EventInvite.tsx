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

  const { isDark } = useTheme();

  const inputRef = useRef(null);
  console.log(inputRef);

  const bgColor = isDark ? "bg-primary-dark" : "bg-primary-light";
  const borderColor = isDark
    ? "border-secondary-dark"
    : "border-secondary-light";

  const styles = {
    inviteButton: "flex-row items-center py-2 px-4 rounded-full",
    inviteCol: isDark ? "bg-background-dark" : "bg-background-light",
    modalContainer: `m-5 p-5 rounded-lg ${bgColor} border ${borderColor} w-4/5`,
  };

  useEffect(() => {
    if (showInvite && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInvite]);

  const handleInvite = async () => {
    {
      setIsLoading(true);
      const user = await getUserByUsername(username);
      await inviteToEvent(eventId, user.user_id);
      setUsername("");
      setShowInvite(false);
    }
  };

  return (
    <SafeAreaView>
      <Text>Invite a User</Text>
      <TouchableOpacity
        onPress={() => setShowInvite(true)}
        className={`${styles.inviteButton} ${styles.inviteCol}`}
      >
        <Ionicons name="person-add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showInvite}
        onRequestClose={() => setShowInvite(false)}
      >
        <KeyboardAvoidingView className="flex-1 justify-center items-center">
          <View className={styles.modalContainer}>
            <View>
              <Text>Invite User</Text>
              <TouchableOpacity onPress={() => setShowInvite(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <TextInput
              ref={inputRef}
              placeholder="Enter username"
              placeholderTextColor={isDark ? "#999" : "#666"}
              value={username}
              onChangeText={(username) => setUsername(username)}
              autoCapitalize="none"
            />

            <View className="flex-row justify-end">
              <TouchableOpacity onPress={handleInvite} disabled={isLoading}>
                <Text>{isLoading ? "Inviting..." : "Send Invite"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};
export default EventInvite;
