import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Dashboard = () => {
    const [sleepData, setSleepData] = useState(null);

    useEffect(() => {
        // Fetch sleep data from Fitbit web API
        const fetchSleepData = async () => {
            try {
                // Make the API request and retrieve sleep data
                const response = await fetch('https://api.fitbit.com/sleep');
                const data = await response.json();

                // Update the sleep data state variable
                setSleepData(data);
            } catch (error) {
                console.error('Error fetching sleep data:', error);
            }
        };

        fetchSleepData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            {sleepData ? (
                <View style={styles.sleepDataContainer}>
                    <Text style={styles.sleepDataTitle}>Sleeping Information:</Text>
                    <Text style={styles.sleepDataValue}>{sleepData.duration} hours</Text>
                    {/* Display additional sleep data as needed */}
                </View>
            ) : (
                <Text style={styles.loadingText}>Loading sleep data...</Text>
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
    sleepDataContainer: {
        backgroundColor: '#f3f3f3',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    sleepDataTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sleepDataValue: {
        fontSize: 16,
    },
    loadingText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
});

export default Dashboard;