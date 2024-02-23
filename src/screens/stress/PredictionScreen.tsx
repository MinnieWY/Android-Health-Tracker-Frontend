import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

const baseStressURL = 'http://192.168.0.159:8080/stress/';

const PredictionScreen = () => {
    const [predictedValue, setPredictedValue] = useState(null);

    useEffect(() => {
        const handlePredictionClick = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(baseStressURL + 'prediction/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId
                    }),
                });
                const data = await response.json();
                setPredictedValue(data.predictedValue);
            } catch (error) {
                console.error('Error updating stress data:', error);
            }
        };
        handlePredictionClick();
    }, []);

    return (
        <View>
            {predictedValue !== null ? (
                <ProgressChart
                    percent={predictedValue}
                    radius={30}
                    borderWidth={5}
                    color="#FF5722"
                    shadowColor="#999"
                    bgColor="#fff"
                >
                    <Text style={{ fontSize: 18 }}>{predictedValue}</Text>
                </ProgressChart>
            ) : (
                <Text>Loading prediction...</Text>
            )}
        </View>
    );
};

export default PredictionScreen;