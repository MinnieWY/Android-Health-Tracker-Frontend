import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Community from './Community';
import CommunitySearch from './CommunitySearch';

const Stack = createStackNavigator();

const CommunityStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Community" component={Community} />
            <Stack.Screen name="CommunitySearch" component={CommunitySearch} />
        </Stack.Navigator>
    );
};

export default CommunityStack;