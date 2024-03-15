import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import ErrorDialog from '../../utils/ErrorDialog';

const QuizHome = (navigation) => {
    const theme = useTheme();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            const response = await fetch('http://192.168.0.159:8080/leaderboard');
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
    }
    const navigateToQuizGame = () => {
        navigation.navigate('Quiz');
    };
    const naviagateToHistory = () => {
        navigation.navigate('Quiz Record List');
    };

    const handleDismissError = () => {
        setError('');
    };

    const maxScore = Math.max(...leaderboardData.map((data) => data.score));

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {error !== "" && (
                <ErrorDialog error={error} onDismiss={handleDismissError} />
            )}
            <Text style={styles.title}>Leaderboard</Text>
            <View style={styles.chartContainer}>
                <Svg width="100%" height={200}>
                    {leaderboardData.map((data, index) => (
                        <Rect
                            key={index}
                            x="0"
                            y={index * 40}
                            width={(data.score / maxScore) * 100 + '%'}
                            height="30"
                            fill="#2196F3"
                        />
                    ))}
                    {leaderboardData.map((data, index) => (
                        <SvgText
                            key={index}
                            x={(data.score / maxScore) * 100 + 5 + '%'}
                            y={index * 40 + 20}
                            fill="#fff"
                            fontSize="12"
                            fontWeight="bold"
                            textAnchor="start"
                            alignmentBaseline="middle"
                        >
                            {data.username}
                        </SvgText>
                    ))}
                </Svg>
            </View>
            <TouchableOpacity onPress={navigateToQuizGame}>
                <Card style={styles.card}>
                    <Text style={styles.cardTitle}>Today's Quiz Game</Text>
                </Card>
            </TouchableOpacity>
            <TouchableOpacity onPress={naviagateToHistory}>
                <Card style={styles.card}>
                    <Text style={styles.cardTitle}>Review your quiz result</Text>
                </Card>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    chartContainer: {
        marginBottom: 16,
    },
    card: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 4,
        marginTop: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default QuizHome;