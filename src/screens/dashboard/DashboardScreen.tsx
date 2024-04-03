import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Card, Provider, Button } from 'react-native-paper';
import ErrorDialog from '../../utils/ErrorDialog';

const DashboardScreen = ({ navigation }) => {
    const [error, setError] = useState('');

    useEffect(() => {


    }, []);

    const handleDismissError = () => {
        setError('');
    };

    const handleNavigateStressManagement = () => {
        navigation.navigate('Stress Management');
    };

    return (
        <Provider>
            <ScrollView style={styles.container}>
                {error !== "" && (
                    <ErrorDialog error={error} onDismiss={handleDismissError} />
                )}
                <View style={styles.rankingContainer}>
                    <Card>
                        <TouchableOpacity onPress={() => navigation.navigate('Ranking')}>
                            <Card.Title title="Know your ranking among the population" />
                            <Card.Cover source={require('../../assets/dashboard_card.jpg')} />
                        </TouchableOpacity>
                    </Card>
                </View>
                <View>
                    <Card>
                        <Card.Title
                            title="How was your day" />
                        <Card.Content>
                            <Text>Rate your stress level here</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                icon="camera"
                                mode="contained"
                                onPress={handleNavigateStressManagement}>
                                Explore
                            </Button>
                        </Card.Actions>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Text>Check your BMI here</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                icon="camera"
                                mode="contained"
                                onPress={() => navigation.navigate('Share')}>
                                Share
                            </Button>
                        </Card.Actions>
                    </Card>
                </View>

            </ScrollView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#ffffff',
    },
    stressContainer: {
        padding: 10,
    },
    stressButton: {
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    rankingContainer: {
        marginBottom: 16,
    },

});

export default DashboardScreen;