import { Text, View, TextInput, Button } from 'react-native'
import { Link } from 'expo-router'
import { useState } from 'react'
import React from 'react'
import {useTheme} from "@/context/ThemeContext";



const signUpPage = () => {
    const [name, setName] = useState('')
    const [nickname, setNickname] = useState('')
    const [description, setDescription] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { colorScheme } = useTheme()

    const applyViewTheme = `${colorScheme === 'dark' ? 'text-white bg-black': 'text-black bg-white'}`
    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black w-full p-3 border border-white rounded-lg': 'text-black bg-white w-full p-3 border border-black rounded-lg'}`


    const onClick = () => {
        const user = { name: name, nickname: nickname, description: description, email: email, password: password, confirmPassword: confirmPassword }
        if (password === confirmPassword) {
            console.log(user)
        } else {
            console.log('passwords do not match')
        }
    }
    return (
        <View className={`flex-1 justify-center items-center ${applyViewTheme}`}>
            <Text className={`text-xl mb-5 ${applyViewTheme}`}>
                Enter your details:
            </Text>
            <View>
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    placeholder='Name'
                    onChangeText={setName} 
                />
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    placeholder='Nickname'
                    onChangeText={setNickname} 
                />
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    placeholder='Email'
                    onChangeText={setEmail} 
                />
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    secureTextEntry={true} 
                    placeholder='Password'
                    onChangeText={setPassword} 
                />
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    secureTextEntry={true} 
                    placeholder='Confirm Password'
                    onChangeText={setConfirmPassword} 
                />
                <TextInput
                    className={`text-l mb-5 ${applyTheme}`}
                    placeholder='Introduce yourself in a few words!' 
                    numberOfLines={2}
                    onChangeText={setDescription} 
                />
                <Button title='Sign Up' onPress={onClick} />

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

