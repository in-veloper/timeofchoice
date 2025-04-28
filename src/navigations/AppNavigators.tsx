import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from '../screens/HomeScreen'
import ModeSelectScreen from '../screens/ModeSelectScreen'
import ResultScreen from '../screens/ResultScreen'

export type RootStackParamList = {
    Home: undefined
    ModeSelect: undefined
    Result: { mode: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
                <Stack.Screen name="Result" component={ResultScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator