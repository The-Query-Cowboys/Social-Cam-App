import React, { createContext, useContext, useEffect } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ColorScheme = "light" | "dark";

interface ThemeContextType {
  colorScheme: "dark" | "light" | undefined;
  toggleColorScheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const COLOR_SCHEME_KEY = "expo-color-scheme";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const loadColorScheme = async (): Promise<void> => {
      try {
        const savedColorScheme = (await AsyncStorage.getItem(
          COLOR_SCHEME_KEY
        )) as ColorScheme | null;
        if (savedColorScheme) {
          setColorScheme(savedColorScheme);
        }
      } catch (err) {
        console.error("Failed to load preferences:", err);
      }
    };
    loadColorScheme();
  }, []);

  const toggleColorScheme = async (): Promise<void> => {
    const next = isDark ? "light" : "dark";
    try {
      await AsyncStorage.setItem(COLOR_SCHEME_KEY, next);
      setColorScheme(next);
      const key = await AsyncStorage.getItem(COLOR_SCHEME_KEY);
    } catch (error) {
      console.error("Failed to save colour scheme:", error);
    }
  };
  const contextValue: ThemeContextType = {
    colorScheme: colorScheme as ColorScheme,
    toggleColorScheme,
    isDark,
  };
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
