import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PALETTE} from '../constants';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen/FigmaHomeScreen';
import GameScreen from '../screens/GameScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Tema gelap supaya tidak ada kilatan putih saat berpindah layar.
const navigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: PALETTE.primary,
    background: PALETTE.background,
    card: PALETTE.background,
    text: PALETTE.white,
    border: PALETTE.backgroundElevated,
  },
};

const AppNavigator: React.FC = () => (
  <NavigationContainer theme={navigationTheme}>
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false, // setiap layar membuat header-nya sendiri
        contentStyle: {backgroundColor: PALETTE.background},
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
