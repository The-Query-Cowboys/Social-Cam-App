import { Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import React from 'react';
import { useTheme } from "@/context/ThemeContext";
import { useSignIn } from "@clerk/clerk-expo";

const logInPage = () => {
    const {colorScheme} = useTheme()
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const applyViewTheme = `${colorScheme === 'dark' ? 'text-white bg-black' : 'text-black bg-white'}`
    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black w-full p-3 border border-white rounded-lg' : 'text-black bg-white w-full p-3 border border-black rounded-lg'}`

    const onSignInPress = async () => {
        if (!isLoaded) return;
        try {
            const signInAttempt = await signIn.create({
                identifier: username, password
            });
            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                console.log(signInAttempt, 'here'); //
                router.replace("/");
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2), 'here2'); //
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <View className={`flex-1 items-center justify-center ${applyViewTheme}`}>
            <Text className={`text-xl mb-5 ${applyViewTheme}`}>
                Log in
            </Text>
            <View>
                <TextInput className={`text-l mb-5 ${applyTheme}`}
                           placeholder='Username'
                           onChangeText={(username) => setUsername(username)}
                           value={username}
                />
                <TextInput className={`text-l mb-5 ${applyTheme}`}
                           secureTextEntry={true}
                           placeholder='Password'
                           onChangeText={(password) => setPassword(password)}
                           value={password}
                />
                <Button title='Login' onPress={onSignInPress}/>

                <Text className={`${applyViewTheme}`}>Don't have an account?
                    <Link href='/signUpPage' className={`color-blue-500 font-bold underline m-1 ${applyViewTheme}`}>
                        Sign Up
                    </Link>
                </Text>

                <Link href='/' className={`${applyViewTheme}`}>Home</Link>
            </View>
        </View>
    )
}

export default logInPage