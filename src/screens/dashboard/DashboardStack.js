import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from './Dashboard';
import MaterialListScreen from '../recommendation/MaterialListScreen';
import StressScreen from '../stress/StressScreen';
import PredictionScreen from '../stress/PredictionScreen';

const Stack = createStackNavigator();

const DashboardStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="RecommendationList" component={MaterialListScreen} />
            <Stack.Screen name="Stress" component={StressScreen} />
            <Stack.Screen name="Prediction" component={PredictionScreen} />
        </Stack.Navigator>
    );
};

export default DashboardStack;