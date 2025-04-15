import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

const DarkModeToggle = () => {
    const {colorScheme, toggleColorScheme} = useTheme();

    return (
        <TouchableOpacity
            onPress={toggleColorScheme}
            className={`p-2 rounded-lg ${colorScheme ? 'bg-gray-800' : 'bg-gray-200'}`}
        >
            <Text className={colorScheme === "light" ? 'text-white' : 'text-black'}>
                {colorScheme === 'light' ? '🌙' : '☀️'}
            </Text>
        </TouchableOpacity>
    );
};

export default DarkModeToggle