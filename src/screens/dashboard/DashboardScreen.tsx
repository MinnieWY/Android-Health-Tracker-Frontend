import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Card, Provider } from 'react-native-paper';
import ErrorDialog from '../../utils/ErrorDialog';

const DashboardScreen = ({ navigation }) => {
    const [hrvData, setHrvData] = useState(null);
    const [stepsData, setStepsData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch("http://192.168.0.159:8080/dashboard/", {
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
                } else {
                    const { data } = result;
                    setHrvData(data.hrv);
                    setStepsData(data.steps);
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
                {hrvData ? (
                    <View style={styles.hrvDataContainer}>
                        <Text style={styles.hrvDataTitle}>HRV Information:</Text>
                        <LineChart
                            data={{
                                labels: Object.keys(hrvData).map(date => date.substring(5, 10)),
                                datasets: [
                                    {
                                        data: Object.values(hrvData),
                                    },
                                ],
                            }}
                            width={Dimensions.get('window').width - 32} // Adjust the width as needed
                            height={220}
                            yAxisLabel=""
                            chartConfig={{
                                backgroundColor: '#f3f3f3',
                                backgroundGradientFrom: '#f3f3f3',
                                backgroundGradientTo: '#f3f3f3',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            bezier
                            style={styles.chart}
                        />
                    </View>
                ) : (
                    <Text style={styles.loadingText}>Loading HRV data...</Text>
                )}
                {stepsData ? (
                    <View style={styles.stepsDataContainer}>
                        <Text style={styles.stepsDataTitle}>Steps Information:</Text>
                        <BarChart
                            data={{
                                labels: Object.keys(stepsData).map(date => date.substring(5, 10)),
                                datasets: [
                                    {
                                        data: Object.values(stepsData),
                                    },
                                ],
                            }}
                            width={Dimensions.get('window').width - 70} // Adjust the width as needed
                            height={220}
                            yAxisLabel=""
                            chartConfig={{
                                backgroundColor: '#f3f3f3',
                                backgroundGradientFrom: '#f3f3f3',
                                backgroundGradientTo: '#f3f3f3',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            style={styles.chart}
                        />
                    </View>
                ) : (
                    <Text style={styles.loadingText}>Loading steps data...</Text>
                )}

            </ScrollView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    rankingContainer: {
        marginBottom: 16,
    },
    hrvDataContainer: {
        backgroundColor: '#f3f3f3',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    hrvDataTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    hrvDataValue: {
        fontSize: 16,
    },
    loadingText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    stepsDataContainer: {
        backgroundColor: '#f3f3f3',
        padding: 8,
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    stepsDataTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default DashboardScreen;