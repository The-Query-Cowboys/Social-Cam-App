import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import { Link } from 'expo-router'

import { useState } from 'react'
import React from 'react'


const signUpPage = () => {
    const [name, setName] = useState('')
    const [nickname, setNickname] = useState('')
    const [description, setDescription] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onClick = () => {
        const user = { name: name, nickname: nickname, description: description, email: email, password: password, confirmPassword: confirmPassword }
        if (password === confirmPassword) {
            console.log(user)
        } else {
            console.log('passwords do not match')
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Sign Up</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder='Name'
                    placeholderTextColor="#666"
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Nickname'
                    placeholderTextColor="#666"
                    onChangeText={setNickname}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    placeholderTextColor="#666"
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder='Password'
                    placeholderTextColor="#666"
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder='Confirm Password'
                    placeholderTextColor="#666"
                    onChangeText={setConfirmPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Introduce yourself in a few words!'
                    numberOfLines={2}
                    placeholderTextColor="#666"
                    onChangeText={setDescription}
                />
                <Button color='#000000' title='Sign Up' onPress={onClick} />

                <Text>Already have an account? <Link href='/logInPage' style={styles.link}>Log In</Link></Text>
            </View>
        </View>
    )
}
/* 
name
nickname
description
password (encrypted)
email
*/

export default signUpPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },
    link: {
        marginVertical: 50,
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    button: {
        backgroundColor: '#000',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
    }
})