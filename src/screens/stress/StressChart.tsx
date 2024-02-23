import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const baseStressURL = 'http://192.168.0.159:8080/stress/';

const StressChart = ({ week }) => {
    const [stressData, setStressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStressData = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(baseStressURL + 'stress/weekly', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        week,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setStressData(data);
                } else {
                    throw new Error('Failed to fetch stress data');
                }
            } catch (error) {
                setError('Error fetching stress data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStressData();
    }, [week]);

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" />
                <Text>Loading stress data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View>
                <Text>{error}</Text>
            </View>
        );
    }

    const trend = calculateTrend(stressData);
    const currentStressLevel = stressData[stressData.length - 1]?.stressLevel;
    function calculateTrend(data) {
        if (data.length < 2) {
            return { text: 'Not enough data to determine the trend', color: '#999' };
        }

        const latestStressLevel = data[data.length - 1].stressLevel;
        const previousStressLevel = data[data.length - 2].stressLevel;

        if (latestStressLevel > previousStressLevel) {
            return { text: 'Stress level is increasing', color: '#FF5722' };
        } else if (latestStressLevel < previousStressLevel) {
            return { text: 'Stress level is decreasing', color: '#4CAF50' };
        } else {
            return { text: 'Stress level is stable', color: '#999' };
        }
    }

    // Get tips based on the stress level
    function getTips(stressLevel) {
        if (!stressLevel) {
            return 'No stress level recorded for today';
        }

        if (stressLevel <= 3) {
            return 'You are doing well! Keep it up!';
        } else if (stressLevel <= 7) {
            return 'Take some time to relax and engage in activities you enjoy';
        } else {
            return 'It seems like you are experiencing high stress. Consider seeking support from friends, family, or professionals';
        }
    }

    return (
        <View>
            <Text>This graph show your stress level over the past week.</Text>
            <Text style={{ color: trend.color }}>{trend.text}</Text>
            <Text>{getTips(currentStressLevel)}</Text>
            <LineChart
                data={{
                    labels: stressData.map((item) => item.date),
                    datasets: [
                        {
                            data: stressData.map((item) => item.value),
                        },
                    ],
                }}
                width={400}
                height={220}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                bezier
            />
        </View>
    );
};

export default StressChart;