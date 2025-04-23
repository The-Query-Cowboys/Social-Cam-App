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
} from "react-native";

import { useUser } from "../../context/UserContext";
import { getUserByUsername, inviteToEvent } from "../api/api";
import { Ionicons } from "@expo/vector-icons";

const EventInvite = ({ eventId }) => {
  const [username, setUsername] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const inputRef = useRef(null);
  console.log(inputRef);

  const toggleInviteDialogue = () => {
    setShowInvite(showInvite ? false : true);
  };

  useEffect(() => {
    console.log(inputRef);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleInvite = async () => {
    const user = await getUserByUsername(username);
    await inviteToEvent(eventId, user.user_id);
    setUsername("");
  };

  if (showInvite) {
    return (
      <KeyboardAvoidingView>
        <TouchableOpacity onPress={handleInvite}>
          <Text>Send Invite</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }

  return (
    <SafeAreaView>
      <TextInput
        ref={inputRef}
        className="w-full border-2 border-black rounded p-4 rounded my-2"
        placeholder="Username"
        placeholderTextColor="#666"
        value={username}
        onChangeText={(username) => setUsername(username)}
      />
      <Text>Invite a User</Text>
      <TouchableOpacity onPress={toggleInviteDialogue}>
        <Ionicons name="person-add" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default EventInvite;
