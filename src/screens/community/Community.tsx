import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';
import { Button, Card, Icon, IconButton, Paragraph, Title } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const Community = ({ navigation }) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [error, setError] = useState('');

    const theme = useTheme();

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await fetch('http://192.168.0.159:8080/top3');
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

    const maxScore = Math.max(...leaderboardData.map((data) => data.point));
    const sortedData = leaderboardData.sort((a, b) => b.point - a.point);

    return (
        <View style={styles.container}>
            <IconButton icon="magnify" size={30} onPress={goToSearchPage} />

            <Card>
                <Card.Title title="Quiz Game" subtitle="Improve your understanding through a simple daily quiz" />
                <Card.Actions>
                    <Button onPress={handleNavigateQuizHome}>Go and Check for What's new today</Button>
                </Card.Actions>
            </Card>

            <View style={styles.rankContainer}>
                <Text style={styles.title}>Leaderboard</Text>
                <Text>Hi</Text><IconButton icon="reload" size={30} /><Text>Hi</Text>
            </View>

            <View style={styles.chartContainer}>
                <Svg width={300} height={300}>
                    <View>
                        {sortedData.map((data, index) => (
                            <React.Fragment key={index}>
                                <Rect
                                    x={50}
                                    y={index * 50 + 50}
                                    width={(data.point / maxScore) * 200}
                                    height={30}
                                    fill="#2196F3"
                                />
                                <SvgText
                                    x={(data.point / maxScore) * 200 + 60}
                                    y={index * 50 + 65}
                                    fill="#fff"
                                    fontSize="12"
                                    fontWeight="bold"
                                    textAnchor="start"
                                    alignmentBaseline="middle"
                                >
                                    {data.username}
                                </SvgText>
                            </React.Fragment>
                        ))}
                    </View>
                </Svg>
            </View>
        </View>
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
    chartContainer: {
        marginTop: 16,
        marginBottom: 16,
        width: '100%', // Set the width to take up the entire available space
        aspectRatio: 2, // Set the aspect ratio to maintain the desired height
    },
});

export default Community;