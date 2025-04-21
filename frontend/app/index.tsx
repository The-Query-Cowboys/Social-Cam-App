import { Text, View, Image } from "react-native";
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

  const applyTheme = `${
    isDark
      ? "text-primary-dark bg-background-dark"
      : "text-primary-light bg-background-light"
  }`;

  const styles = {
    container: `flex-1 items-center ${applyTheme}`,
  };

  return (
    <View className={`flex-1 items-center justify-center ${applyTheme}`}>
      <View className="absolute top-4 right-4 items-center">
        <Text className={`${applyTheme}`}>Theme: </Text>
        <DarkModeToggle />
      </View>
      <Image source={icon} className="my-5" />
      <Text className={`text-xl font-bold mt-8 ${applyTheme}`}>
        Hello world
      </Text>
      <Link
        href="/(dashboard)/publicEventPage"
        className={`my-8 border-b ${applyTheme}`}
      >
        Event Page
      </Link>
      <Link
        href="/(dashboard)/createEvent"
        className={`my-8 border-b ${applyTheme}`}
      >
        Create Event
      </Link>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Text className={`my-8 ${applyTheme}`}>Signed out</Text>
        <Link
          href="/(auth)/logInPage"
          className={`my-8 border-b ${applyTheme}`}
        >
          Login
        </Link>
      </SignedOut>
      <Link href="/camera/1" className={`my-8 border-b ${applyTheme}`}>
        Camera
      </Link>
      <Link href="/(design)/themeShowcase">THEME EXAMPLE PAGE</Link>
    </View>
  );
};

export default Home;
