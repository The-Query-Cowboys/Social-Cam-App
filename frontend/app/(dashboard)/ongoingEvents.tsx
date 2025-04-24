import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import OngoingEvents from "../components/OngoingEvents";

const ongoingEvents = () => {
  const { isDark } = useTheme();

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`}
    >
      <Stack.Screen options={{ href: null }} />
      <View className="px-4 py-2 flex-1">
        <OngoingEvents />
      </View>
    </SafeAreaView>
  );
};

export default ongoingEvents;
