import {Text, View, TextInput, Button} from 'react-native';
import {Link} from 'expo-router';
import {useState} from 'react';
import React from 'react';
import {useTheme} from "@/context/ThemeContext";

const logInPage = () => {
    const {colorScheme} = useTheme()

    const applyViewTheme = `${colorScheme === 'dark' ? 'text-white bg-black' : 'text-black bg-white'}`
    const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black w-full p-3 border border-white rounded-lg' : 'text-black bg-white w-full p-3 border border-black rounded-lg'}`

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onClick = () => {
        console.log(username, password)
        if (username === 'dev' && password === 'dev') {
            console.log('Login successful')
        } else {
            console.log('Login failed')
        }
    }

    return (
        <View className={`flex-1 items-center justify-center ${applyViewTheme}`}>
            <Text className={`text-xl mb-5 ${applyViewTheme}`}>
                Log in
            </Text>
            <View>
                <TextInput className={`text-l mb-5 ${applyTheme}`}
                           placeholder='Username'
                           onChangeText={setUsername}
                />
                <TextInput className={`text-l mb-5 ${applyTheme}`}
                           secureTextEntry={true}
                           placeholder='Password'
                           onChangeText={setPassword}
                />
                <Button title='Login' onPress={onClick}/>

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