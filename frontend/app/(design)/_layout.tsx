import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function DesignLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "bg-neonGreen-500" : "#FE654F",
        },
        headerTintColor: isDark ? "#f9fafb" : "#f9fafb",
        contentStyle: {
          backgroundColor: isDark ? "#2B2D42" : "#FE654F",
        },
      }}
    />
  );
}
