import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import ErrorDialog from '../../utils/ErrorDialog';
import { StressTrendDTO } from '../../common/dto';
import { serverURL } from '../../api/config';

const baseStressURL = `${serverURL}stress/`;

const StressChart = () => {
    const [stressData, setStressData] = useState(null as StressTrendDTO | null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchStressData = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(baseStressURL + 'trend', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                    }),
                });
                const result = await response.json();
                if (result.error) {
                    switch (result.error) {
                        case 'ERROR_GET_WEEKLY_STRESS_FAILED':
                            setFetching(false);
                            console.error('Failed to get weekly stress data');
                            setError('Failed to get weekly stress data');
                            break;
                        default:
                            setFetching(false);
                            console.error('Unexpected error in server:', result.error);
                            setError('Server error');
                            break;
                    }
                } else {
                    const { data } = result as { data: StressTrendDTO };
                    setStressData(data);
                    setFetching(false);
                }
            } catch (error) {
                setFetching(false);
                console.error('Error when fetch Stress Data in Server:', error);
                setError('Server Error');
            }
        };

        fetchStressData();
    }, []);

    const handleDismissError = () => {
        setError('');
    };


    const getSuggestions = (trend) => {
        switch (trend) {
            case 'Fluctuating':
                return 'Try to identify any patterns or triggers that cause fluctuations in your stress levels.';
            case 'Increasing':
                return 'Consider implementing stress management techniques such as meditation or exercise.';
            case 'Decreasing':
                return 'Great job! Continue practicing stress management techniques to maintain your stress levels.';
            case 'Constant':
                return 'Monitor your stress levels and try to identify any factors contributing to a constant level of stress.';
            default:
                return '';
        }
    };

    return (
        <View>
            {error && <ErrorDialog error={error} onDismiss={handleDismissError} />}

            {fetching && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} size="large" color={'blue'} />
                    <Text style={styles.loadingText}>Fetching data...</Text>
                </View>
            )}
            {!fetching && stressData && (
                <View>
                    <Text style={styles.title}>Stress Trend</Text>
                    <DataTable style={styles.dataTable}>
                        <DataTable.Row>
                            <DataTable.Cell>Mean Stress Level:</DataTable.Cell>
                            <DataTable.Cell numeric>{stressData.mean}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Mode Stress Level:</DataTable.Cell>
                            <DataTable.Cell numeric>{stressData.mode}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Trend:</DataTable.Cell>
                            <DataTable.Cell numeric>{stressData.trend}</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>

                    <Text style={styles.suggestions}>{getSuggestions(stressData.trend)}</Text>
                </View>
            )}
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dataTable: {
        marginBottom: 20,
        backgroundColor: 'white',
    },
    suggestions: {
        fontSize: 16,
        marginVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default StressChart;