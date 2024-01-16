import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Setting from '../screens/profile/Setting';
import Profile from '../screens/profile/Profile';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="Profile" component={Profile} />
                <Drawer.Screen name="Setting" component={Setting} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;