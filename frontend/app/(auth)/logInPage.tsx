import { Text, View, TextInput, Button, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSignIn, useAuth } from "@clerk/clerk-expo";
import { registerUserPushToken } from "../api/notificationService";
import { getUserByAuthId } from "../api/api";

const logInPage = () => {
  const { colorScheme } = useTheme();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { userId } = useAuth();
  const router = useRouter();

  const [usernameSession, setUsername] = useState("");
  const [passwordSession, setPassword] = useState("");

  const [isLoginError, setIsLoginError] = useState(false);

  let username = "Guest"
  let password = "randomGuest6666.."


  const applyViewTheme = `${colorScheme === "dark" ? "text-white bg-black" : "text-black bg-white"
    }`;
  const applyTheme = `${colorScheme === "dark"
    ? "text-white bg-black w-full p-3 border border-white rounded-lg"
    : "text-black bg-white w-full p-3 border border-black rounded-lg"
    }`;

  const inputStyle = `w-full p-3 mb-5 rounded-lg border ${colorScheme === "dark"
    ? "text-white bg-black border-white"
    : "text-black bg-white border-black"
    }`;

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
    <View className={`flex-1 items-center ${applyViewTheme}`}>
      <View className={`w-[85%] max-w-md ${applyViewTheme}`}>
        <Text className={`text-2xl font-bold mb-8 text-center  ${applyViewTheme}`}>Log in</Text>
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
          <Text className={applyViewTheme}>
            Don't have an account?
            <Link
              href="/signUpPage"
              className={`color-blue-500 font-bold underline m-1 ${applyViewTheme}`}
            >
              Sign Up
            </Link>
          </Text>

          <Link href="/" className={`color-blue-500 font-bold underline m-1 ${applyViewTheme}`}>
            Home
          </Link>
        </View>
        {isLoginError ? <Text className={`color-red-500`}>Error when logging in, please check your username and password</Text> : null}
      </View>
    </View>
  );
};

export default logInPage;