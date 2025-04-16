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
            headerStyle: {backgroundColor: isDarkMode ? '#605d5d' : '#ddd'},
            headerTintColor: isDarkMode ? '#fff' : '#333',
        }}>
            <Stack.Screen name='index' options={{title: 'Home'}}/>
        </Stack>
    )
}

export default RootLayout

