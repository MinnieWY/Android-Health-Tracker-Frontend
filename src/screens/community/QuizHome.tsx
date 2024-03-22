import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Provider } from 'react-native-paper';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import ErrorDialog from '../../utils/ErrorDialog';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RankDTO } from '../../common/dto';

const QuizHome = (navigation) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [ranking, setRanking] = useState<RankDTO | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRanking();
    }, []);

    const fetchRanking = async () => {
        try {
            const userId = AsyncStorage.getItem('userId');
            const response = await fetch('http://192.168.0.159:8080/ranke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                })
            });
            const result = await response.json();

            if (result.error) {
                switch (result.error) {
                    case 'ERR_NOT_FOUND':
                        setError('User not found');
                        break;
                    default:
                        console.error('Unexpected error in Server:', result.error);
                        setError('Server error');
                }
            } else {
                const { data } = result as { data: RankDTO };
                setRanking(data);

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

    return (
        <Provider>
            <ScrollView style={styles.container}>
                {error !== "" && (
                    <ErrorDialog error={error} onDismiss={handleDismissError} />
                )}
                <Card style={styles.card}>
                    <TouchableOpacity onPress={navigateToQuizGame}>
                        <Text style={styles.cardTitle}>Today's Quiz Game</Text>
                    </TouchableOpacity>
                </Card>

                <Card style={styles.card}>
                    <TouchableOpacity onPress={naviagateToHistory}>
                        <Text style={styles.cardTitle}>Review your quiz result</Text>
                    </TouchableOpacity>
                </Card>
            </ScrollView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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