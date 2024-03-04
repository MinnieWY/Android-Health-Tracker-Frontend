import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, FAB } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';

const baseStressURL = 'http://192.168.0.159:8080/stress/';

const StressScreen = ({ navigation }) => {
    const [currentStressLevel, setCurrentStressLevel] = useState(0);
    const [showRatingSection, setShowRatingSection] = useState(true);
    const [showRingCircle, setShowRingCircle] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [todayStressLevel, setTodayStressLevel] = useState();
    const [isFabVisible, setIsFabVisible] = useState(false);

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
                const data = await response.json();
                console.log('Today stress data:', data);
                setCurrentStressLevel(data);
                setShowRatingSection(false);
                setShowRingCircle(true);
                setTodayStressLevel(data);
                setFetchingData(false);
            } catch (error) {
                console.error('Error fetching today stress data:', error);
                setFetchingData(false);
            }
        };
        fetchTodayStressData();
    }, [showRatingSection, showRingCircle, todayStressLevel]);

    const handleSliderChange = (value) => {
        setCurrentStressLevel(value);
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
            const data = await response.json();
            setShowRatingSection(false);
            setShowRingCircle(true);
            setTodayStressLevel(1);
            console.log('Stress level updated:', showRatingSection, showRingCircle, todayStressLevel);
        } catch (error) {
            console.error('Error updating stress level:', error);
        }
    };

    const handlePredictionClick = () => {
        navigation.navigate('Prediction');
    };

    const handleFabPress = () => {
        // Add code to navigate to the page for updating stress records in the past
    };

    return (
        <View style={styles.container}>
            {showRatingSection && (
                <View>
                    <Text style={styles.centerText}>Rate your stress level</Text>
                    <Text style={styles.centerText}>{currentStressLevel}</Text>
                    <Slider
                        style={{ height: 120 }}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={5}
                        minimumTrackTintColor="blue"
                        maximumTrackTintColor="red"
                        renderStepNumber={true}
                        onValueChange={handleSliderChange}
                    />
                    <Button icon="content-save-check" mode="contained" onPress={handleUpdateClick}>
                        Save
                    </Button>
                    <Text style={styles.centerText}>Or click the following button to predict your stress level</Text>
                    <Button icon="cloud-search" mode="contained" onPress={handlePredictionClick}>
                        Predict
                    </Button>
                </View>
            )}
            {showRingCircle && (
                <View>
                    <Text>Latest stress level:</Text>
                    {fetchingData && todayStressLevel ? (
                        <View style={styles.emoticonContainer}>
                            {todayStressLevel <= 3 && <FontAwesome name="smile-o" size={50} color="green" />}
                            {todayStressLevel > 3 && todayStressLevel <= 7 && <FontAwesome name="meh-o" size={50} color="orange" />}
                            {todayStressLevel > 7 && <FontAwesome name="frown-o" size={50} color="red" />}
                            <Text style={{ fontSize: 18 }}>{todayStressLevel}</Text>
                        </View>
                    ) : (
                        <Text>No stress level recorded for today</Text>
                    )}
                    <FAB
                        style={styles.fab}
                        icon="pencil"
                        onPress={handleFabPress}
                        visible={isFabVisible}
                        onStateChange={({ open }) => setIsFabVisible(open)}
                    />
                </View>
            )}
            <View>
                <Text>Stress can affect people in various ways...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerText: {
        textAlign: 'center',
        marginBottom: 10,
    },
    emoticonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default StressScreen;