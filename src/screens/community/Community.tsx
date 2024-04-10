import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';
import { Button, Card, Icon, IconButton, Paragraph, Provider, Title } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import ErrorDialog from '../../utils/ErrorDialog';
import { serverURL } from '../../api/config';

const Community = ({ navigation }) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [error, setError] = useState('');

    const theme = useTheme();

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await fetch(`${serverURL}/top3`);
                const result = await response.json();

                if (result.error) {
                    switch (result.error) {
                        case 'ERR_NOT_FOUND':
                            setError('Result not found');
                            break;
                        default:
                            console.error('Unexpected error:', result.error);
                            setError('Server error');
                    }
                } else {
                    const { data } = result;
                    setLeaderboardData(data);
                }
            } catch (error) {
                console.error('Not catched error in Frontend:', error);
                setError('Server error');
            }
        };
        fetchLeaderboardData();
    }, []);

    const goToSearchPage = () => {
        navigation.navigate('User Search');
    };

    const handleNavigateQuizHome = () => {
        navigation.navigate('Quiz');
    };

    return (
        <Provider>
            <View style={styles.container}>
                <ErrorDialog error={error} onDismiss={setError} />
                <View>
                    <Text>Search User</Text>
                    <IconButton icon="magnify" size={30} onPress={goToSearchPage} />
                </View>
                <Card>
                    <Card.Title title="Quiz Game" subtitle="Improve your understanding through a simple daily quiz" />
                    <Card.Actions>
                        <Button onPress={handleNavigateQuizHome}>Go and Check for What's new today</Button>
                    </Card.Actions>
                </Card>


            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    rankContainer: {
        marginTop: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default Community;