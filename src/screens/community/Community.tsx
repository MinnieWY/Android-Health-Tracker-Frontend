import React from 'react';
import { View, Text, Button } from 'react-native';

const Community = ({ navigation }) => {
    // Handle navigation to the search page
    const goToSearchPage = () => {
        navigation.navigate('CommunitySearch');
    };

    return (
        <View>
            <Text>Welcome to the Community!</Text>
            <Button title="Search Friends" onPress={goToSearchPage} />
        </View>
    );
};

export default Community;