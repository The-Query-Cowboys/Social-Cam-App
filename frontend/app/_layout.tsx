import '../global.css'
import {Stack} from 'expo-router'
import {ThemeProvider, useTheme} from '../context/ThemeContext'

const RootLayout = () => {
    return (
        <ThemeProvider>
            <LayoutContent/>
        </ThemeProvider>
    )
}

const LayoutContent = () => {
    const {colorScheme} = useTheme();
    const isDarkMode = colorScheme === 'dark';


    return (
        <Stack screenOptions={{
            headerStyle: {backgroundColor: isDarkMode ? '#1a1a1a' : '#ddd'},
            headerTintColor: isDarkMode ? '#fff' : '#333',
            contentStyle: {backgroundColor: isDarkMode ? '#000' : '#fff',},
        }}>
            <Stack.Screen name='index' options={{title: 'Home'}}/>
        </Stack>
    )
}

export default RootLayout

