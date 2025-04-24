import {
  Text,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// @ts-ignore
import icon from "../assets/favicon.png";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import DarkModeToggle from "@/app/components/DarkModeToggle";
//
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { SignOutButton } from "@/app/(auth)/logOut";
import { useUser } from "../context/UserContext";

import { appwriteGetFile } from "@/appwrite/appwrite.api";
import { getUserEvents } from "./api/api";

const Home = () => {
  const { isDark } = useTheme();
  const { user } = useUser();

  const [hasOngoingEvents, setHasOngoingEvents] = useState(false);

  const bg = isDark ? "bg-background-dark" : "bg-background-light";
  const text = isDark ? "text-text-dark" : "text-text-light";
  const title = isDark ? "text-primary-dark" : "text-primary-light";
  const bgPrimary = isDark ? "bg-primary-dark" : "bg-primary-light";
  const bgSecondary = isDark ? "bg-secondary-dark" : "bg-secondary-light";

  const styles = {
    container: `flex-1 items-center ${bg}`,
    header: `flex-row justify-between items-center px-5 py-4`,
    title: `text-2xl justify-between items-center px-5 py-4 ${title}`,
    content: "flex-1 items-center justify-center w-full px-6",
    welcomeText: `text-lg font-medium mb-4 ${text}`,
    navButtonContainer: "w-full flex items-center gap-6 space-y-4",
    navButton: `py-3 px-8 border rounded-lg w-4/5 max-w-md mx-auto flex items-center justify-center text-center  font-bold ${
      isDark
        ? "bg-primary-dark text-text-dark"
        : "bg-secondary-light text-text-light"
    }`,
    primaryButton: `py-3 px-8 rounded-lg  items-center w-[85%] ${bgPrimary}`,
    secondaryButton: `py-3 px-8 border rounded-lg items-center w-[85%] mt-3 ${bgSecondary}`,
  };

  useEffect(() => {
    async function getFileTest() {
      const file = await appwriteGetFile("");
    }
    getFileTest();
  });

  useEffect(() => {
    const checkOngoingEvents = async () => {
      if (!user) return;

      try {
        const userEvents = await getUserEvents(user.user_id, [2]);
        const now = new Date();

        const ongoing = userEvents.some((event) => {
          const startDate = new Date(event.event_date);
          const endDate = new Date(event.event_date_end);
          return startDate <= now && now <= endDate;
        });

        setHasOngoingEvents(ongoing);
      } catch (err) {
        console.error(err);
      }
    };

    checkOngoingEvents();
  }, [user]);
  return (
    <SafeAreaView className={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className={styles.header}>
        <Text className={styles.title}>POSABLE</Text>
        <DarkModeToggle />
      </View>
      <SignedIn>
        <View className={styles.content}>
          <Image source={icon} className="my-5" />
          <Text className={styles.welcomeText}>Welcome to POSABLE</Text>
          {hasOngoingEvents && (
            <Link href="/(dashboard)/ongoingEvents" asChild>
              <TouchableOpacity
                className={`flex-row items-center p-3 rounded-lg mb-3  w-4/5 max-w-md mx-auto text-right ${
                  isDark ? "bg-neonGreen-700" : "bg-neonGreen-500"
                }`}
              >
                <Ionicons
                  name="radio"
                  size={22}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white font-bold">
                  You have events happening now!
                </Text>
              </TouchableOpacity>
            </Link>
          )}
          <View className={styles.navButtonContainer}>
            <Link
              href="/(dashboard)/publicEventPage"
              className={styles.navButton}
            >
              <Text>Event Page</Text>
            </Link>
          </View>
          <View className={styles.navButtonContainer}>
            <Link href="/(dashboard)/albumList" className={styles.navButton}>
              <Text className={text}>Albums Page</Text>
            </Link>
          </View>
          <Link href="/(dashboard)/createEvent" className={styles.navButton}>
            <Text className={text}>Create Event</Text>
          </Link>

          <SignOutButton />
        </View>
      </SignedIn>
      <SignedOut>
        <Text className={`my-8 ${text}`}>Please sign in to use POSABLE</Text>
        <Link href="/(auth)/logInPage" className={styles.primaryButton}>
          <Text className={text}>Sign In</Text>
        </Link>

        <Link href="/(auth)/signUpPage" className={styles.secondaryButton}>
          <Text className={text}>Create Account</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>
  );
};

export default Home;
