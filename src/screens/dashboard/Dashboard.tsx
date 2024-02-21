import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const Dashboard = () => {
    const [hrvData, setHrvData] = useState(null);
    const [stepsData, setStepsData] = useState(null);

    useEffect(() => {
        // Fetch HRV data from the backend API
        const fetchHrvData = async () => {
            try {
                const response = await fetch("http://192.168.0.159:8080/dashboard", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();
                setHrvData(data.hrv);
                setStepsData(data.steps);
            } catch (error) {
                console.error('Error fetching Dashboard data:', error);
            }
        };

        fetchHrvData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
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

export default Dashboard;