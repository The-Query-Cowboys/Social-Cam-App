import { Tabs } from "expo-router";
import React from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

const dashboardLayout = () => {
  const { isDark } = useTheme();
  // not sure if this is necessary, tab styles don't use the same nomenclature as nativewind for strings
  const tabBarBackground = isDark ? " #101820" : "#eedaea";
  const tabBarActive = isDark ? "#aadb1e" : "#4ECDC4";
  const [tabColors, setTabColors] = useState({
    background: isDark ? "#101820" : "#eedaea",
    active: isDark ? "#aadb1e" : "#4ECDC4",
    inactive: isDark ? "#f65275" : "#1f2937",
    border: isDark ? "#252525" : "#d1d5db",
  });

  // Update colors whenever theme changes
  useEffect(() => {
    setTabColors({
      background: isDark ? "#101820" : "#eedaea",
      active: isDark ? "#aadb1e" : "#4ECDC4",
      inactive: isDark ? "#f65275" : "#1f2937",
      border: isDark ? "#f65275" : "#d1d5db",
    });
  }, [isDark]);

  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: tabColors.background,
            paddingTop: 10,
            height: 90,
            borderTopColor: tabColors.border,
          },
          tabBarActiveTintColor: tabColors.active,
          tabBarInactiveTintColor: tabColors.inactive,
        }}
      >
        <Tabs.Screen
          name="createEvent"
          options={{
            title: "Create Event",
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="publicEventPage"
          options={{
            title: "Upcoming Events",
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="albumList"
          options={{
            title: "Albums",
            tabBarIcon: ({ color }) => (
              <Ionicons name="images-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen name="albumCard" options={{ href: null }} />
      </Tabs>
    </UserProvider>
  );
};

export default dashboardLayout;
