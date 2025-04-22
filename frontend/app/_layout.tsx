import "../global.css";
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { registerUserPushToken } from "./api/notificationService";
import { getUserByAuthId, getUserById } from "./api/api";
import { useEffect } from "react";

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
  const { isSignedIn, userId } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    async function registerPushToken() {
      if (isSignedIn && userId) {
        try {
          const user = await getUserByAuthId(userId);

          registerUserPushToken(user.user_id);
        } catch (err) {
          console.error(err);
        }
      }
    }
    registerPushToken();
  }, [isSignedIn, userId]);

export default RootLayout;
