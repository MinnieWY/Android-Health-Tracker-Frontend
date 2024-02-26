import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from './Dashboard';
import MaterialListScreen from '../recommendation/MaterialListScreen';

const Stack = createStackNavigator();

const DashboardStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="RecommendationList" component={MaterialListScreen} />
        </Stack.Navigator>
    );
};

export default DashboardStack;