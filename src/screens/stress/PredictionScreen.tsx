import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

const baseStressURL = 'http://192.168.0.159:8080/stress/';

const PredictionScreen = () => {
    const [predictedValue, setPredictedValue] = useState(null);
    const [modifiedValue, setModifiedValue] = useState(null);
    const [isModifying, setIsModifying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

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

    const handleModifyClick = () => {
        setIsModifying(true);
    };

    const handleSliderChange = (value) => {
        setModifiedValue(value);
    };

    const handleSaveClick = async () => {
        setIsSaving(true);

        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(baseStressURL + 'input', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    date: new Date().toDateString(),
                    stressLevel: modifiedValue,
                }),
            });

            if (response.ok) {
                setIsSaved(true);
                setPredictedValue(modifiedValue);
            }
        } catch (error) {
            console.error('Error saving value:', error);
        }

        setIsSaving(false);
    };

    return (
        <View>
            {isModifying ? (
                <View>
                    <Text>Modify Stress Level:</Text>
                    <Slider
                        style={{ width: 200, height: 40 }}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={modifiedValue || predictedValue}
                        onValueChange={handleSliderChange}
                    />
                    <Button title="Save" onPress={handleSaveClick} />
                </View>
            ) : (
                <View>
                    {predictedValue !== null ? (
                        <View>
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
                            {!isSaved && (
                                <Button title="Modify Value" onPress={handleModifyClick} />
                            )}
                            {isSaved && <Text>Modification is done.</Text>}
                        </View>
                    ) : (
                        <Text>Loading prediction...</Text>
                    )}
                </View>
            )}
        </View>
    );
};
export default PredictionScreen;