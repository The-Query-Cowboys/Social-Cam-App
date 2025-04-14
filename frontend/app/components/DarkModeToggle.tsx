import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleDarkMode}
      className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
    >
      <Text className={isDarkMode ? 'text-white' : 'text-black'}>
        {isDarkMode ? '🌙' : '☀️'}
      </Text>
    </TouchableOpacity>
  );
}; 

export default DarkModeToggle