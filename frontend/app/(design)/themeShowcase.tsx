import React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import ThemeShowcase from "../components/ThemeShowcase";
import ColorShowcase from "../components/ColorShowcase";

const ThemeShowcasePage = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const [page, setPage] = useState("colour");

  const togglePage = () => {
    page === "colour" ? setPage("theme") : setPage("colour");
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "Design System",
          headerStyle: {
            backgroundColor: isDark ? "#BF0848" : "#FB93B7",
          },
          headerTintColor: isDark ? "#ffffff" : "#333333",
          headerRight: () => (
            <TouchableOpacity
              onPress={togglePage}
              className={`mr-4 bg-secondary-${
                isDark ? "dark" : "light"
              } px-4 py-2 rounded-lg flex items-center justify-end self-end active:opacity-80`}
            >
              <Text className="text-lg font-bold text-background-dark">
                {page}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      {page === "colour" ? <ColorShowcase /> : <ThemeShowcase />}
    </View>
  );
};

export default ThemeShowcasePage;
