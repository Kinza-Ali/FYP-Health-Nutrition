import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {View,SafeAreaView,Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/screens/Login';
import ChatbotScreen from './app/screens/Chatbot';

const Stack = createStackNavigator();

export default function App() {
  // eslint-disable-next-line prettier/prettier
  return (    <NavigationContainer initialRouteName="Login">
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name="Chatbot"
          component={ChatbotScreen}
          options={{title: 'NutriGuide'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
   );
}
