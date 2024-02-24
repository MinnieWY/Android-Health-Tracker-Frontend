import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/screens/login/Login';
import ForgetPassword from './src/screens/login/ForgetPassword';
import Registration from './src/screens/login/Registration';
import Dashboard from './src/screens/dashboard/Dashboard';
import Profile from './src/screens/profile/Profile';
import Community from './src/screens/community/Community';
import { View, Image } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './src/redux/reducers';
import AuthContext from './src/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const store = createStore(rootReducer);

function SplashScreen() {
  return (
    <View>
      <Image source={require('./src/assets/logo.png')} />
    </View>
  );

}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="Registration" component={Registration} />
    </Stack.Navigator>
  );
}

const AuthenticatedStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'game-controller' : 'game-controller-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Community" component={Community} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <AuthContext.Provider value={{ setIsLoggedIn }}>
        <NavigationContainer>
          {isLoggedIn ? (
            <AuthenticatedStack />
          ) : (
            <AuthStack />
          )}
        </NavigationContainer>
      </AuthContext.Provider>
    </Provider>
  );
}