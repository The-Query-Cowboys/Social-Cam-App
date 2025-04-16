import { Text, View, TextInput, Button, TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTheme } from "@/context/ThemeContext";
import { useSignUp } from "@clerk/clerk-expo";


const signUpPage = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [authId, setAuthId] = useState<string|null>("");
    console.log(authId)
    const router = useRouter();
    const [username, setUsername] = useState('')
    const [description, setDescription] = useState('')
    const [emailAddress, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const { colorScheme } = useTheme()

    const applyViewTheme = `${colorScheme === 'dark' ? 'text-white bg-black': 'text-black bg-white'}`
    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black w-full p-3 border border-white rounded-lg': 'text-black bg-white w-full p-3 border border-black rounded-lg'}`


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
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded) return;
        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            });
            console.log(signUpAttempt, 'pending');
            if (signUpAttempt.status === "complete") {
                setAuthId(signUpAttempt.createdUserId)

                await setActive({ session: signUpAttempt.createdSessionId });
                router.replace("/");
            } else {
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    if (pendingVerification) {
        return (
            <>
                <Text>Verify your email</Text>
                <TextInput
                    value={code}
                    placeholder="Enter your verification code"
                    onChangeText={(code) => setCode(code)}
                />
                <TouchableOpacity onPress={onVerifyPress}>
                    <Text>Verify</Text>
                </TouchableOpacity>
            </>
        );
    }

    return (
        <View className={`flex-1 justify-center items-center ${applyViewTheme}`}>
            <Text className={`text-xl mb-5 ${applyViewTheme}`}>
                Enter your details:
            </Text>
            <View>
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    placeholder='Email'
                    onChangeText={(emailAddress) => setEmail(emailAddress)}
                    value={emailAddress}
                />
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    placeholder='Username'
                    onChangeText={(username) => setUsername(username)}
                    value={username}
                />
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    secureTextEntry={true} 
                    placeholder='Password'
                    onChangeText={(password) => setPassword(password)}
                    value={password}
                />
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    secureTextEntry={true} 
                    placeholder='Confirm Password'
                    onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                    value={confirmPassword}
                />
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    placeholder='Introduce yourself in a few words!' 
                    numberOfLines={2}
                    onChangeText={(description) => setDescription(description)}
                    value={description}
                />
                <Button title='Sign Up' onPress={onSignUpPress} />

                <Text className={`text-l mb-5 ${applyViewTheme}`}>Already have an account?
                    <Link href='/logInPage' className={`m-1 text-blue-500 underline font-bold`}>
                        Log In
                    </Link>
                </Text>
            </View>
        </View>
    )
}

export default signUpPage
/* 
name
nickname
description
password (encrypted)
email
*/