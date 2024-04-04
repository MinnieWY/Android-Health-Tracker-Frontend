import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, FAB, Headline, IconButton, Provider, Title } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';
import { StressDTO } from '../../common/dto';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-calendars';
import ErrorDialog from '../../utils/ErrorDialog';
import StressChart from './StressChart';
import Mission from './Mission';

const baseStressURL = 'http://192.168.0.159:8080/stress/';

const StressScreen = ({ navigation }) => {
    const [currentStressLevel, setCurrentStressLevel] = useState(0);
    const [showRatingSection, setShowRatingSection] = useState(true);
    const [showRingCircle, setShowRingCircle] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [todayStressLevel, setTodayStressLevel] = useState(0);
    const [predictedValue, setPredictedValue] = useState(null);
    const [previousWeekStressData, setPreviousWeekStressData] = useState([]);
    const [updateLoading, setupdateLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchTodayStressData = async () => {
            try {
                setFetchingData(true);
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(baseStressURL + 'today', {
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
                    if (result.error == 'ERR_NOT_FOUND') {
                        setError('User not found');
                    } else if (result.error == 'ERROR_STRESS_RECORD_EXIST') {
                        console.error('here');
                        setError('Stress record already exists');
                    } else {
                        console.error('Unexpected error in Server:', result.error);
                        setError('Server error');
                    }

                } else {
                    const { data } = result;
                    if (data == 0) {
                        setShowRatingSection(true);
                        setShowRingCircle(false);
                    } else {
                        setShowRatingSection(false);
                        setShowRingCircle(true);
                        setTodayStressLevel(data);
                    }
                }
                setFetchingData(false);
            } catch (error) {
                console.error('Not catched error in Frontend:', error);
                setError('Server error');
            }
        };
        fetchTodayStressData();
    }, [showRatingSection, showRingCircle]);

    const handleSliderChange = (value) => {
        setCurrentStressLevel(value);
    };


    const handlePredictionClick = async () => {
        try {
            setupdateLoading(true);
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(baseStressURL + 'prediction', {
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
                switch (result.error) {
                    case 'ABSENT_FEATURES':
                        console.error('Missing data for analysis.');
                        setError('Missing data for analysis. Please sync data before process.');
                        break;
                    default:
                        console.error('Unexpected error:', result.error);
                        setError('Server error. Please try it later.');
                        setupdateLoading(false);
                        break;
                }
            } else {
                const { data } = result;
                setPredictedValue(data);
                setupdateLoading(false);
            }

        } catch (error) {
            console.error('Error updating stress data:', error);
            setError('Server error');
            setupdateLoading(false);
        }
    };

    const handleUpdateClick = async () => {
        if (currentStressLevel === 0 || currentStressLevel === null || currentStressLevel === undefined || currentStressLevel > 5) {
            setError('Please select a valid stress level');
            return;
        }
        setupdateLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId');
            console.log('level:', currentStressLevel)
            const response = await fetch(baseStressURL + 'input', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    date: new Date().toISOString().split('T')[0],
                    stressLevel: currentStressLevel,
                }),
            });
            const result = await response.json();
            if (result.error) {
                console.error('Unexpected error in server:', result.error);
                setError('Server error');
                setupdateLoading(false);
            } else {
                const { data } = result as { data: StressDTO };
                console.log('data:', data)
                setTodayStressLevel(data.stressLevel);
                setShowRatingSection(false);
                setShowRingCircle(true);
                setupdateLoading(false);
            }
        } catch (error) {
            console.error('Error updating stress level:', error);
            setError('Server error');
            setupdateLoading(false);
        }
    };



    const handleDismissError = () => {
        setError('');
        // navigation.navigate('Dashboard');
    };

    return (
        <Provider>
            <ScrollView contentContainerStyle={styles.container}>
                {error !== '' && <ErrorDialog error={error} onDismiss={handleDismissError} />}

                {showRatingSection && (
                    <View style={styles.ratingContainer}>
                        <Title style={{ paddingBottom: 30 }}>Rate your stress level</Title>
                        <View style={styles.sliderContainer}>
                            <Text style={styles.sliderLabel}>Low</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={5}
                                step={1}
                                value={currentStressLevel}
                                onValueChange={handleSliderChange}
                            />
                            <Text style={styles.sliderLabel}>High</Text>
                        </View>

                        <Button style={styles.button} mode="contained" onPress={handleUpdateClick} disabled={updateLoading}  >
                            Save
                        </Button>


                        <Button style={styles.button} mode="contained" onPress={handlePredictionClick} disabled={updateLoading}>
                            Analysis
                        </Button>

                    </View>
                )}

                {updateLoading && (
                    <View>
                        <ActivityIndicator animating={true} size="large" color={'blue'} />
                        <Text style={{ fontSize: 40, textAlign: 'center' }} >Processing...</Text>
                    </View>
                )}


                {showRingCircle && (
                    <View>
                        <Headline>Today's stress level</Headline>
                        {!fetchingData && todayStressLevel ? (
                            <>
                                <View style={styles.emoticonContainer}>
                                    {todayStressLevel <= 3 && <FontAwesome name="smile-o" size={150} color="green" />}
                                    {todayStressLevel > 3 && todayStressLevel <= 7 && <FontAwesome name="meh-o" size={150} color="orange" />}
                                    {todayStressLevel > 7 && <FontAwesome name="frown-o" size={150} color="red" />}

                                </View>
                                <Text style={{ fontSize: 25, textAlign: 'center' }}>{todayStressLevel}</Text>
                            </>
                        ) : (
                            <Text>No stress level recorded for today</Text>
                        )}
                    </View>
                )}


                <StressChart />
                <Text style={styles.title}>Stress Management Missions</Text>
                <Mission />



            </ScrollView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    ratingContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    sliderContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    slider: {
        flex: 1,
    },
    sliderLabels: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderLabel: {
        fontSize: 16,
    },
    ratingText: {
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        width: 120,
        marginBottom: 16,
    },
    circleContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f9a825',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    circleText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    circleLabel: {
        fontSize: 16,
    },
    calendarContainer: {
        marginBottom: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#f9a825',
    },
    emoticonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    selectionContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    selectedDateText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    stressLevelText: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default StressScreen;