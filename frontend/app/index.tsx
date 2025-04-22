import { Text, View, Image, SafeAreaView, StatusBar } from "react-native";
import { Link } from "expo-router";
// @ts-ignore
import icon from "../assets/favicon.png";
import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import DarkModeToggle from "@/app/components/DarkModeToggle";
//
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { SignOutButton } from "@/app/(auth)/logOut";

const Home = () => {
  const { isDark } = useTheme();

  const bg = isDark ? "bg-background-dark" : "bg-background-light";
  const text = isDark ? "text-text-dark" : "text-text-light";
  const title = isDark ? "text-primary-dark" : "text-primary-light";
  const bgPrimary = isDark ? "bg-primary-dark" : "bg-primary-light";
  const bgSecondary = isDark ? "bg-secondary-dark" : "bg-secondary-light";

  const styles = {
    container: `flex-1 items-center ${bg}`,
    header: `flex-row justify-between items-center px-5 py-4`,
    title: `text-2xl justify-between items-center px-5 py-4 ${title}`,
    content: "flex-1 items-center justify-center px-6",
    welcomeText: `text-lg font-medium mb-4 ${text}`,
    navButtonContainer: "w-full items-center gap-4",
    navButton: `py-3 px-8 border rounded-lg w-full items-center ${
      isDark ? "border-gray-600" : "border-gray-300"
    }`,
    primaryButton: `py-3 px-8 rounded-lg w-full items-center ${bgPrimary}`,
    secondaryButton: `py-3 px-8 border rounded-lg w-full items-center mt-3 ${bgSecondary}`,
  };
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
        </View>
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
            <Text>Albums Page</Text>
          </Link>
        </View>
        <Link href="/(dashboard)/createEvent" className={styles.navButton}>
          Create Event
        </Link>
        <Link href="/camera/1" className={styles.navButton}>
          Camera
        </Link>
        <Link href="/(design)/themeShowcase" className={styles.navButton}>
          THEME EXAMPLE PAGE
        </Link>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Text className={`my-8 ${text}`}>Please sign in to use POSABLE</Text>
        <Link href="/(auth)/logInPage" className={styles.primaryButton}>
          <Text className={text}>Sign In</Text>
        </Link>

        <Link href="/(auth)/signUpPage" className={styles.secondaryButton}>
          <Text className={text}>Create Account</Text>
        </Link>
        <Link href="/camera/1" className={styles.navButton}>
          Camera
        </Link>
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
            <Text>Albums Page</Text>
          </Link>
        </View>
        <Link href="/(dashboard)/createEvent" className={styles.navButton}>
          Create Event
        </Link>
        <Link href="/(design)/themeShowcase" className={styles.navButton}>
          THEME EXAMPLE PAGE
        </Link>
      </SignedOut>
    </SafeAreaView>
  );
};

export default Home;
