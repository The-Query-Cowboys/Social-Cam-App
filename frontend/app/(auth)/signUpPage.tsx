import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSignUp } from "@clerk/clerk-expo";
import { createUser } from "../api/api";
import { registerUserPushToken } from "../api/notificationService";

const signUpPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [authId, setAuthId] = useState<string | null>("");
  console.log(authId);
  const router = useRouter();
  const [username, setUsername] = useState("");
  //const [description, setDescription] = useState("");
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const { colorScheme } = useTheme();


  const [isError, setIsError] = useState(false);

  const applyViewTheme = `${
    colorScheme === "dark" ? "text-white bg-black" : "text-black bg-white"
  }`;
  const applyTheme = `${
    colorScheme === "dark"
      ? "text-white bg-black w-full p-3 border border-white rounded-lg"
      : "text-black bg-white w-full p-3 border border-black rounded-lg"
  }`;

  const inputStyle = `w-full p-3 mb-5 rounded-lg border ${
    colorScheme === "dark"
      ? "text-white bg-black border-white"
      : "text-black bg-white border-black"
  }`;

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress,
        password,
        username,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setIsError(false)
    } catch (err) {
      // console.error(JSON.stringify(err, null, 2));
      setIsError(true)
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete" && signUpAttempt.createdUserId) {
        setAuthId(signUpAttempt.createdUserId);
        createUser(username, emailAddress, signUpAttempt.createdUserId);
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
        setIsError(false)
      } else {
        // console.error(JSON.stringify(signUpAttempt, null, 2));
        setIsError(true)
      }
    } catch (err) {
      // console.error(JSON.stringify(err, null, 2));
      setIsError(true)
    }
  };

  if (pendingVerification) {
    return (
      <View className={`flex-1 pt-16 items-center ${applyViewTheme}`}>
        <View className="w-[85%] max-w-md">
          <Text className={`text-xl mb-6 text-center ${applyViewTheme}`}>
            Verify your email
          </Text>
          <TextInput
            className={inputStyle}
            value={code}
            placeholder="Enter your verification code"
            onChangeText={(code) => setCode(code)}
          />
          <TouchableOpacity
            className="w-full h-12 bg-blue-500 rounded-lg items-center justify-center"
            onPress={onVerifyPress}
          >
            <Text className="text-white font-semibold">Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 items-center ${applyViewTheme}`}>
      <View className="w-[85%] max-w-md">
        <Text
          className={`text-2xl font-bold mb-8 text-center  ${applyViewTheme}`}
        >
          Create Account
        </Text>
        <TextInput
          className={inputStyle}
          placeholder="Email"
          onChangeText={(emailAddress) => setEmail(emailAddress)}
          value={emailAddress}
        />
        <TextInput
          className={inputStyle}
          placeholder="Username"
          onChangeText={(username) => setUsername(username)}
          value={username}
        />
        <TextInput
          className={inputStyle}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          value={password}
        />
        <TextInput
          className={inputStyle}
          secureTextEntry={true}
          placeholder="Confirm Password"
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
          value={confirmPassword}
        />
        {/* <TextInput
          className={`text-l mb-5 ${applyTheme}`}
          placeholder="Introduce yourself in a few words!"
          numberOfLines={2}
          onChangeText={(description) => setDescription(description)}
          value={description}
        /> */}
        <TouchableOpacity
          className="w-full h-12 bg-blue-500 rounded-lg items-center justify-center mb-6"
          onPress={onSignUpPress}
        >
          <Text>Sign Up</Text>
        </TouchableOpacity>

        <Text className={`text-l mb-5 ${applyViewTheme}`}>
          Already have an account?
          <Link
            href="/logInPage"
            className={`m-1 text-blue-500 underline font-bold`}
          >
            Log In
          </Link>
        </Text>
        {isError ? <Text className={`color-red-500`}>Error creating an account, please check your entries</Text> : null}
      </View>
    </View>
  );
};

export default signUpPage;
/* 
name
nickname
description
password (encrypted)
email
*/
