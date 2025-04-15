import React, {createContext, useContext} from 'react';
import {useColorScheme} from 'nativewind';

type ThemeContextType = {
    colorScheme: 'light' | 'dark' | undefined;
    toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({children}: { children: React.ReactNode }) => {
    const {colorScheme, toggleColorScheme} = useColorScheme();

    return (
        <ThemeContext.Provider value={{colorScheme, toggleColorScheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export {useTheme, ThemeProvider}