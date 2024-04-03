import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, FAB, Headline, Provider } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';
import { StressDTO } from '../../common/dto';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-calendars';
import ErrorDialog from '../../utils/ErrorDialog';

const baseStressURL = 'http://192.168.0.159:8080/stress/';

const StressScreen = ({ navigation }) => {
    const [currentStressLevel, setCurrentStressLevel] = useState(0);
    const [showRatingSection, setShowRatingSection] = useState(true);
    const [showRingCircle, setShowRingCircle] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [todayStressLevel, setTodayStressLevel] = useState(0);
    const [isFabVisible, setIsFabVisible] = useState(false);
    const [error, setError] = useState('');
    const [monthStressRecords, setMonthStressRecords] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].substring(5, 7));
    const [selectedYear, setSelectedYear] = useState(new Date().toISOString().split('T')[0].substring(0, 4));
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStressLevel, setSelectedStressLevel] = useState(0);

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
                    switch (result.error) {
                        case 'ERR_NOT_FOUND':
                            setError('User not found');
                            break;
                        default:
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
        fetchMonthStressData(selectedMonth, selectedYear);
    }, [showRatingSection, showRingCircle, selectedMonth]);

    const handleSliderChange = (value) => {
        setCurrentStressLevel(value);
    };

    const fetchSelectedStressData = async (selectedDateString) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(baseStressURL + 'today', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    date: selectedDateString
                }),
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
                const { data } = result;
                if (data == 0) {
                    setSelectedStressLevel(0);
                } else {
                    setSelectedStressLevel(data);
                }
            }
        } catch (error) {
            console.error('Not catched error in Frontend:', error);
            setError('Server error');
        }
    };

    const fetchMonthStressData = async (month, year) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(baseStressURL + 'monthly', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    month,
                    year,
                }),
            });
            const result = await response.json();

            if (result.error) {
                console.error('Unexpected error in server:', result.error);
                setError('Server error');
            } else {
                const { data } = result as { data: StressDTO[] };
                const updatedMarkedDates = { ...markedDates };
                data.forEach((record) => {
                    updatedMarkedDates[record.date] = { marked: true };
                });
                setMarkedDates(updatedMarkedDates);
            }
        } catch (error) {
            console.error('Error in Frontend:', error);
            setError('Server error');
        }
    };

    const handleUpdateClick = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
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
            } else {
                const { data } = result as { data: StressDTO };
                setShowRatingSection(false);
                setShowRingCircle(true);
                setTodayStressLevel(data.stressLevel);
            }
        } catch (error) {
            console.error('Error updating stress level:', error);
            setError('Server error');
        }
    };

    const handlePredictionClick = () => {
        navigation.navigate('Prediction');
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
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={10}
                                step={1}
                                value={currentStressLevel}
                                onValueChange={handleSliderChange}
                                thumbTintColor="#f9a825"
                                minimumTrackTintColor="#f9a825"
                                maximumTrackTintColor="#bdbdbd"
                            />
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderLabel}>0</Text>
                                <Text style={styles.sliderLabel}>10</Text>
                            </View>
                        </View>
                        <Text style={styles.ratingText}>Rate your stress level</Text>
                        <Button style={styles.button} mode="contained" onPress={handleUpdateClick}>
                            Update
                        </Button>

                        {isFabVisible && (
                            <FAB
                                style={styles.fab}
                                icon={({ size, color }) => (
                                    <FontAwesome name="edit" size={size} color={color} />
                                )}
                                onPress={handlePredictionClick}
                            />
                        )}
                    </View>
                )}
                {showRingCircle && (
                    <View>
                        <Headline>Today's stress level</Headline>
                        {!fetchingData && todayStressLevel ? (
                            <View style={styles.emoticonContainer}>
                                {todayStressLevel <= 3 && <FontAwesome name="smile-o" size={150} color="green" />}
                                {todayStressLevel > 3 && todayStressLevel <= 7 && <FontAwesome name="meh-o" size={150} color="orange" />}
                                {todayStressLevel > 7 && <FontAwesome name="frown-o" size={150} color="red" />}
                                <Text style={{ fontSize: 18 }}>{todayStressLevel}</Text>
                            </View>
                        ) : (
                            <Text>No stress level recorded for today</Text>
                        )}
                    </View>
                )}
                <View style={styles.calendarContainer}>
                    <Calendar
                        markingType={'dot'}
                        markedDates={monthStressRecords}
                        const onDayPress={(day) => {
                            const selectedDateString = day.dateString;
                            fetchSelectedStressData(selectedDateString);
                        }}
                        onMonthChange={(month) => {
                            setSelectedMonth(month.dateString.substring(5, 7));
                            setSelectedYear(month.dateString.substring(0, 4));
                            fetchMonthStressData(selectedMonth, selectedYear);
                        }}
                        theme={{
                            textDayFontFamily: 'Roboto',
                            textMonthFontFamily: 'Roboto',
                            textDayHeaderFontFamily: 'Roboto',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 16,
                            todayTextColor: '#f9a825',
                            arrowColor: '#f9a825',
                        }}
                    />
                </View>
                {selectedDate && selectedStressLevel && (
                    <View style={styles.selectionContainer}>
                        <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
                        {selectedStressLevel > 0 ? (
                            <Text style={styles.stressLevelText}>Stress Level: {selectedStressLevel}</Text>
                        ) : (
                            <Text style={styles.stressLevelText}>No record found</Text>
                        )
                        }
                        {selectedStressLevel == 0 && (
                            <Button onPress={handleOpenStressInput}>Update</Button>
                        )}

                    </View>
                )}
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