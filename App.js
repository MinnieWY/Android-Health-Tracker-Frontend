import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/screens/login/Login';
import ForgetPassword from './src/screens/login/ForgetPassword';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import ShareScreen from './src/screens/dashboard/ShareScreen';
import RankingScreen from './src/screens/dashboard/RankingScreen';
import StressScreen from './src/screens/stress/StressScreen';
import TutorialHomeScreen from './src/screens/recommendation/TutorialHomeScreen';
import MaterialListScreen from './src/screens/recommendation/MaterialListScreen';
import MaterialDetailScreen from './src/screens/recommendation/MaterialDetailScreen';
import BreathingInro from './src/screens/recommendation/BreathingIntro';
import BreathingExercise from './src/screens/recommendation/BreathingExercise';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import PersonalInfoScreen from './src/screens/profile/PersonalInfoScreen';
import EditPersonalInfoScreen from './src/screens/profile/EditPersonalInfoScreen';
import AboutUsScreen from './src/screens/profile/AboutUsScreen';
import Community from './src/screens/community/Community';
import CommunitySearch from './src/screens/community/CommunitySearch';
import QuizeHome from './src/screens/community/QuizHome';
import QuizeScreen from './src/screens/community/QuizScreen';
import QuizHistory from './src/screens/community/QuizHistory';
import QuizRecord from './src/screens/community/QuizRecord';

import { View, Image, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './src/redux/reducers';
import AuthContext from './src/AuthContext';
import ErrorDialog from './src/utils/ErrorDialog';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const store = createStore(rootReducer);


function SplashScreen() {
  const windowWidth = Dimensions.get('window').width;
  const logoSize = windowWidth * 0.5;

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
    </Stack.Navigator>
  );
}

function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Ranking" component={RankingScreen} />
      <Stack.Screen name="Share" component={ShareScreen} />
      <Stack.Screen name='Stress Management' component={StressScreen} />
    </Stack.Navigator>
  );
}

function Recommendation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tutorial" component={TutorialHomeScreen} />
      <Stack.Screen name="Available Materials" component={MaterialListScreen} />
      <Stack.Screen name="Lesson" component={MaterialDetailScreen} />
      <Stack.Screen name="What is Breathing Exercise?" component={BreathingInro} />
      <Stack.Screen name="Exercise" component={BreathingExercise} headerShown={false} />
    </Stack.Navigator>
  );
}

function Profile() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile Screen" component={ProfileScreen} />
      <Stack.Screen name="Community" component={Community} />
      <Stack.Screen name="User Search" component={CommunitySearch} />
      <Stack.Screen name="Personal Information" component={PersonalInfoScreen} />
      <Stack.Screen name="Edit Personal Information" component={EditPersonalInfoScreen} />
      <Stack.Screen name="Quiz" component={QuizeHome} />
      <Stack.Screen name="Quiz of Today" component={QuizeScreen} />
      <Stack.Screen name="Quiz Record List" component={QuizHistory} />
      <Stack.Screen name="Quiz Record" component={QuizRecord} />
      <Stack.Screen name="About Us" component={AboutUsScreen} />
    </Stack.Navigator>
  );

}

const AuthenticatedStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
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
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Tutorial" component={Recommendation} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  const handleDismissError = () => {
    setError("");
  };

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
      {error !== "" && (
        <ErrorDialog error={error} onDismiss={handleDismissError} />
      )}
    </Provider>
  );
}