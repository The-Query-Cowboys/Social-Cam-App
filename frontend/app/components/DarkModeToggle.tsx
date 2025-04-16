import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useTheme} from '../../context/ThemeContext';


const DarkModeToggle = () => {
    const {colorScheme, toggleColorScheme} = useTheme();

    return (
        <TouchableOpacity
            onPress={toggleColorScheme}
            className={`p-2 rounded-lg ${colorScheme === 'dark' ? 'bg-gray-200' : 'bg-gray-700'}`}
        >
            <Text>
                {colorScheme === 'light' ? '🌙' : '☀️'}
            </Text>
        </TouchableOpacity>
    );
};

export default DarkModeToggle