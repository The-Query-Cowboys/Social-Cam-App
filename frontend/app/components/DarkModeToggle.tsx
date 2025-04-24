import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const DarkModeToggle = () => {
  const { toggleColorScheme, isDark } = useTheme();
  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      className={`p-2 rounded-lg ${
        isDark ? "bg-primary-dark" : "bg-primary-light"
      }`}
    >
      <Text className="t">{!isDark ? "🌙" : "☀️"}</Text>
    </TouchableOpacity>
  );
};

export default DarkModeToggle;
