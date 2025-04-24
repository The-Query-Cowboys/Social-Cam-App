import { Text, View, TextInput, Button, ScrollView, SafeAreaView } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSignIn, useAuth } from "@clerk/clerk-expo";
import { registerUserPushToken } from "../api/notificationService";
import { getUserByAuthId } from "../api/api";
import { Ionicons } from "@expo/vector-icons";

const logInPage = () => {
  const { colorScheme } = useTheme();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { userId } = useAuth();
  const router = useRouter();

  const [usernameSession, setUsername] = useState("");
  const [passwordSession, setPassword] = useState("");

  const [isLoginError, setIsLoginError] = useState(false);

  const { isDark } = useTheme();

  let username = "Guest"
  let password = "randomGuest6666.."

  const applyViewTheme = `${colorScheme === "dark" ? "text-white bg-black" : "text-black bg-white"
    }`;

  const inputStyle = `w-full p-3 mb-5 rounded-lg border ${colorScheme === "dark"
    ? "text-white bg-black border-white"
    : "text-black bg-white border-black"
    }`;

  const styles = {
    container: `flex-1 text-xl ${isDark ? "text-white" : "text-black"}`,
    header: `"p-4 mb-10 flex-row justify-between items-center border-b" ${isDark ? "text-white" : "text-black"}`,
    loadingContainer: "flex-1 justify-center items-center",
    errorText: `text-center p-4 ${isDark ? "text-white" : "text-black"}`,
    page: `flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"
      }`,
    homeLink: `font-bold ${isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
    title: `text-xl font-bold ${isDark ? "text-foreground-dark" : "text-primary-light"
      }`,
    separator: `border-b-2 my-4 ${isDark ? "border-pinkRed-700" : "border-pinkRed-500"
      }`
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      let signInAttempt;

      signInAttempt = await signIn.create({
        identifier: username,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        if (userId) {
          const userData = getUserByAuthId(userId);
          setIsLoginError(false)
          //await registerUserPushToken(userData.user_id);
        }

        router.replace("/");
      } else {
        // console.error(JSON.stringify(signInAttempt, null, 2), "here2"); //
        setIsLoginError(true);
      }
    } catch (err) {
      // console.error(JSON.stringify(err, null, 2));
      setIsLoginError(true);
    }
  };

  return (
    <SafeAreaView className={`${styles.page}`}>
      {/* <View className={`flex-1 items-center`}> */}
      <View className={`flex-row justify-between mb-4 px-4 pt-2 ${styles.separator}`}>
        <Link href="/" className={`${styles.homeLink}`}>
          <Ionicons
            name="home-outline"
            size={24}
            color={isDark ? "#f65275" : "#1f2937"}
          />
        </Link>
        <Text className={`${styles.title} mb-6`}>Log in</Text>
        <View />
      </View>
      <View className={`w-[85%] flex-1 m-[7.5%]`}>
        <View>
          <TextInput
            className={inputStyle}
            placeholder="Username"
            onChangeText={(usernameSession) => setUsername(usernameSession)}
            value={usernameSession}
          />
          <TextInput
            className={inputStyle}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={(passwordSession) => setPassword(passwordSession)}
            value={passwordSession}
          />
          <Button title="Login" onPress={() => {
            username = usernameSession
            password = passwordSession
            onSignInPress()
          }} />
          <Text></Text>
          <Button title="Login as guest" onPress={onSignInPress} />
          <Text></Text>
          <Text className={`pl-[10%]`}>
            Don't have an account?
            <Link
              href="/signUpPage"
              className={`color-blue-500 font-bold underline`}
            >
              Sign Up
            </Link>
          </Text>
        </View>
        {isLoginError ? <Text className={`color-red-500`}>Error when logging in, please check your username and password</Text> : null}
      </View>
      {/* </View> */}
    </SafeAreaView>
  );
};

export default logInPage;