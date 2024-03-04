import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/screens/login/Login';
import ForgetPassword from './src/screens/login/ForgetPassword';
import Registration from './src/screens/login/Registration';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import TutorialHomeScreen from './src/screens/tutorial/TutorialHomeScreen';
import MaterialListScreen from './src/screens/recommendation/MaterialListScreen';
import MaterialDetailScreen from './src/screens/recommendation/MaterialDetailScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import EditPersonalInfoScreen from './src/screens/profile/EditPersonalInfoScreen';
import AboutUsScreen from './src/screens/profile/AboutUsScreen';
import Community from './src/screens/community/Community';
import { View, Image, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './src/redux/reducers';
import AuthContext from './src/AuthContext';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const store = createStore(rootReducer);


function SplashScreen() {
  const windowWidth = Dimensions.get('window').width;
  const logoSize = windowWidth * 0.5; // Adjust the scaling factor as needed

  return (
    <View>
      <Image
        source={require('./src/assets/logo.png')}
        style={{ width: logoSize, height: logoSize, alignSelf: 'center' }}
      />
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

function Dashboard() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
    </Stack.Navigator>
  );
}

function Tutorial() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TutorialHome" component={TutorialHomeScreen} />
      <Stack.Screen name="MaterialList" component={MaterialListScreen} />
      <Stack.Screen name="MaterialDetail" component={MaterialDetailScreen} />
    </Stack.Navigator>
  );
}

function Profile() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Community" component={Community} />
      <Stack.Screen name="EditPersonalInfo" component={EditPersonalInfoScreen} />
      <Stack.Screen name="AboutUS" component={AboutUsScreen} />
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
          } else if (route.name === 'Tutorial') {
            iconName = focused ? 'game-controller' : 'game-controller-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
      options={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Tab.Screen name="Tutorial" component={Tutorial} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});