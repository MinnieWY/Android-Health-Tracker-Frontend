import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Card, Provider, Button, ActivityIndicator } from 'react-native-paper';
import ErrorDialog from '../../utils/ErrorDialog';
import Sleep from './Sleep';
import BMI from './BMI';
import { serverURL } from '../../api/config';
const DashboardScreen = ({ navigation }) => {
    const [error, setError] = useState('');
    const [loadStep, setLoadStep] = useState(true);
    const [stepsData, setStepsData] = useState([]);
    const [averageSteps, setAverageSteps] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoadStep(true);
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(`${serverURL}dashboard/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId
                    }),
                });

                const result = await response.json();
                if (result.error) {
                    console.error('Unexpected error in server:', result.error);
                    setError('Server error');
                    setLoadStep(false);
                } else {
                    const { data } = result;
                    setStepsData(data.steps);

                    // setTotalSteps(getTotalSteps(stepsData));
                    // setAverageSteps(getAverageSteps(totalSteps));

                    setTotalSteps(85340);
                    setAverageSteps(12191);

                    setLoadStep(false);
                }
            } catch (error) {
                console.error('Error in Frontend:', error);
                setError('Server error');
            }
        };

        fetchDashboardData();
    }, []);

    const handleDismissError = () => {
        setError('');
    };

    const handleNavigateStressManagement = () => {
        navigation.navigate('Stress Management');
    };

    const getAverageSteps = (totalSteps) => {
        return totalSteps / 7;
    }

    const getTotalSteps = (data) => {
        let totalSteps = 0;

        for (const date in data) {
            totalSteps += data[date];
        }

        return totalSteps;
    }

    return (
        <Provider>
            <ScrollView style={styles.container}>
                {error !== "" && (
                    <ErrorDialog error={error} onDismiss={handleDismissError} />
                )}
                <BMI />
                <View style={styles.stressContainer}>
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
                    <Sleep />
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 20, marginVertical: 10 }}>Your Activities</Text>
                        {loadStep && (
                            <View>
                                <ActivityIndicator animating={true} size="large" color={'blue'} />
                                <Text style={{ fontSize: 20, textAlign: 'center' }} >Loading Activity Data...</Text>
                            </View>)}
                        {!loadStep && stepsData && (
                            <View style={styles.stepsDataContainer}>
                                <BarChart
                                    data={{
                                        labels: Object.keys(stepsData).map(date => date.substring(5, 10)),
                                        datasets: [
                                            {
                                                data: Object.values(stepsData),
                                            },
                                        ],
                                    }}
                                    width={Dimensions.get('window').width - 110}
                                    height={190}
                                    yAxisLabel=""
                                    chartConfig={{
                                        backgroundColor: '#f3f3f3',
                                        backgroundGradientFrom: '#f3f3f3',
                                        backgroundGradientTo: '#f3f3f3',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        propsForLabels: {
                                            fontSize: 12,
                                        },
                                    }}
                                    withInnerLines={false}
                                    style={styles.chart}
                                />
                                <Card>
                                    <Card.Content>
                                        <Text>You have walked average of {averageSteps} for past 7 days</Text>
                                        {averageSteps > 42000 && (
                                            <Text style={{ color: 'green' }}>Share your achivement with friends</Text>
                                        )}
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button
                                            icon="share-variant"
                                            mode="contained"
                                            onPress={() => navigation.navigate('Share', { date: Object.keys(stepsData)[0], steps: averageSteps })}
                                        //disabled={averageSteps < 42000}
                                        >
                                            Share
                                        </Button>
                                    </Card.Actions>
                                </Card>
                            </View>
                        )}
                    </View>
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
        marginTop: 16,
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
    chart: {
        marginVertical: 10,
        marginHorizontal: 10,
    },
    stepsDataContainer: {
        backgroundColor: '#f3f3f3',
        padding: 5,
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    stepsDataTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    loadingText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
});

export default DashboardScreen;