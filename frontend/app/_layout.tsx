import '../global.css'
import {Stack} from 'expo-router'
import {ThemeProvider, useTheme} from '../context/ThemeContext'
import {ClerkProvider} from '@clerk/clerk-expo'
import {tokenCache} from "@clerk/clerk-expo/token-cache";

const RootLayout = () => {

    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <ThemeProvider>
                <LayoutContent/>
            </ThemeProvider>
        </ClerkProvider>
    )
}

const LayoutContent = () => {
    const {colorScheme} = useTheme();
    const isDarkMode = colorScheme === 'dark';

    return (
        <Stack screenOptions={{
            headerStyle: {backgroundColor: isDarkMode ? '#605d5d' : '#ddd'},
            headerTintColor: isDarkMode ? '#fff' : '#333',
        }}>
            <Stack.Screen name='createEvent' options={{title: 'Create new event'}}/>
            <Stack.Screen name='index' options={{title: 'Home'}}/>
        </Stack>
    )
}

export default RootLayout