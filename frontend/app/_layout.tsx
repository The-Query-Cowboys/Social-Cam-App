import "../global.css";
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

const RootLayout = () => {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ThemeProvider>
        <LayoutContent />
      </ThemeProvider>
    </ClerkProvider>
  );
};

const LayoutContent = () => {
  const { isDark } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark
            ? "bg-background-dark"
            : "bg-background-light",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "POSABLE" }} />
      <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      <Stack.Screen name="(design)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
