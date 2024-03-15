import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const Community = ({ navigation }) => {
    const theme = useTheme();
    const goToSearchPage = () => {
        navigation.navigate('CommunitySearch');
    };

    const handleNavigateQuizHome = () => {
        navigation.navigate('Quiz');
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <Text>Welcome to the Community!</Text>
            <Button onPress={goToSearchPage}>Search Friends</Button>

            <Card>
                <Card.Title title="Quiz Game" subtitle="Improve your understanding through a simple daily quiz" />
                <Card.Actions>
                    <Button onPress={handleNavigateQuizHome}>Go and Check for What's new today</Button>
                </Card.Actions>
            </Card>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});


export default Community;