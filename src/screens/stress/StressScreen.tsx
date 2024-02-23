import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ProgressChart } from 'react-native-chart-kit';
import { View, Text, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Slider from '@react-native-community/slider';
import Tabs from "react-native-material-tabs";
import StressChart from './StressChart';
import { useNavigation } from '@react-navigation/native';

const baseStressURL = 'http://192.168.0.159:8080/stress/';

const StressScreen = (navigation) => {
    const [currentStressLevel, setCurrentStressLevel] = useState(0);
    const [showRatingSection, setShowRatingSection] = useState(true);
    const [showRingCircle, setShowRingCircle] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [currentWeek, setCurrentWeek] = useState(null);


    useEffect(() => {
        const getCurrentWeek = () => {
            const today = new Date();
            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
            const currentWeekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            setCurrentWeek(currentWeekNumber);
            setSelectedWeek(currentWeekNumber);
        };

        const fetchTodayStressData = async () => {
            try {
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
                const stressLevel = getStressLevelForToday(data);
                setCurrentStressLevel(stressLevel);
                setShowRatingSection(!stressLevel);
                setShowRingCircle(!!stressLevel);
            } catch (error) {
                console.error('Error fetching today stress data:', error);
            }
        }

        getCurrentWeek();
    }, []);

    const getStressLevelForToday = (data) => {
        const today = new Date().toISOString().split('T')[0];
        const todayData = data.find((item) => item.date === today);
        return todayData ? todayData.stressLevel : null;
    };

    const handleSliderChange = (value) => {
        setCurrentStressLevel(value);
    };

    const handleUpdateClick = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(baseStressURL + 'input/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    date: new Date().toDateString(),
                    stressLevel: currentStressLevel
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error updating stress data:', error);
        }
    };

    const handleWeekSelection = (week) => {
        setSelectedWeek(week);
    };

    const handlePredictionClick = () => {
        navigation.navigate('Prediction');
    };

    return (
        <View>
            {showRatingSection && (
                <View>
                    <Text>Rate your stress level:</Text>
                    <Slider
                        style={{ width: 200, height: 40 }}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={currentStressLevel || 5}
                        onValueChange={handleSliderChange}
                        disabled={currentStressLevel !== null}
                    />
                    <Button title="Update" onPress={handleUpdateClick} />
                </View>
            )}

            {
                showRingCircle && (
                    <View>
                        <Text>Latest stress level:</Text>
                        {currentStressLevel ? (
                            <ProgressChart
                                percent={currentStressLevel * 10}
                                radius={30}
                                borderWidth={5}
                                color="#FF5722"
                                shadowColor="#999"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{currentStressLevel}</Text>
                            </ProgressChart>
                        ) : (
                            <Text>No stress level recorded for today</Text>
                        )}
                    </View>
                )
            }
            <StressChart week={currentWeek} />
            <View>
                <Tabs
                    selectedIndex={selectedTab}
                    onChange={(index) => setSelectedTab(index)}
                >
                    <Tabs.Item label="History" />
                    <Tabs.Item label="Effectsof Stress" />
                </Tabs>

                {selectedTab === 0 &&
                    <View>
                        {/* Render week options */}
                        <Button title="Week 1" onPress={() => handleWeekSelection(1)} />
                        <Button title="Week 2" onPress={() => handleWeekSelection(2)} />
                        <Button title="Week 3" onPress={() => handleWeekSelection(3)} />
                        <Button title="Week 4" onPress={() => handleWeekSelection(4)} />

                        {/* Conditionally render the chart component based on selectedWeek */}
                        {selectedWeek && <StressChart week={selectedWeek} />}
                    </View>
                }

                {selectedTab === 1 && (
                    <View>
                        <Text>Stress can affect people in various ways...</Text>
                    </View>
                )}
            </View>
            <Button title="Predict Stress" onPress={handlePredictionClick} />
        </View>
    )
};

export default StressScreen;