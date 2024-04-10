import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';

const BreathingExercise = () => {
    const [counter, setCounter] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [rounds, setRounds] = useState(1);
    const [currentRound, setCurrentRound] = useState(1);
    const [isRoundsCompleted, setIsRoundsCompleted] = useState(false);
    const [selectedRound, setSelectedRound] = useState(null);

    useEffect(() => {
        let intervalId;

        if (isRunning) {
            intervalId = setInterval(() => {
                setCounter((prevCounter) => prevCounter + 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isRunning]);

    const startExercise = () => {
        setIsRunning(true);
        setCounter(0);
        setBackgroundColor('#FFFFFF');
        setCurrentRound(1);
        setIsRoundsCompleted(false);
    };

    const formatTime = (seconds) => {
        const remainingSeconds = seconds % 18;
        return `${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (isRunning) {
            if (counter === 0) {
                setBackgroundColor('#FFCDD2');
            } else if (counter === 5) {
                setBackgroundColor('#BBDEFB');
            } else if (counter === 11) {
                setBackgroundColor('#C8E6C9');
            }
        }

        if (counter === 18 && currentRound < rounds) {
            setCounter(0);
            setCurrentRound((prevRound) => prevRound + 1);
        }

        if (counter === 18 && currentRound === rounds) {
            setIsRoundsCompleted(true);
            setBackgroundColor('#FFFFFF');
            setIsRunning(false);
        }

    }, [counter, currentRound, rounds]);

    const handleRoundSelection = (selectedRounds) => {
        setSelectedRound(selectedRounds);
        setRounds(selectedRounds);
    };

    const getInstructionsText = (isRunning, isCompleted, counter) => {
        if (isRunning) {
            if (counter <= 4) {
                return `Take a deep breath \n ${4 - counter}`;
            } else if (counter <= 11) {
                return `Hold your breath \n ${11 - counter}`;
            } else if (counter <= 18) {
                return `Release your breath slowly \n ${18 - counter}`;
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {!isRunning && !isRoundsCompleted && (
                <View>
                    <Text variant="headlineSmall" style={styles.modalTitle}>Select Number of Rounds</Text>
                    <View style={styles.roundsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.roundButton,
                                selectedRound === 3 && styles.selectedRoundButton,
                            ]}
                            onPress={() => handleRoundSelection(3)}
                        >
                            <Text style={styles.roundButtonText}>3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.roundButton,
                                selectedRound === 5 && styles.selectedRoundButton,
                            ]}
                            onPress={() => handleRoundSelection(5)}
                        >
                            <Text style={styles.roundButtonText}>5</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.roundsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.roundButton,
                                selectedRound === 10 && styles.selectedRoundButton,
                            ]}
                            onPress={() => handleRoundSelection(10)}
                        >
                            <Text style={styles.roundButtonText}>10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.roundButton,
                                selectedRound === 20 && styles.selectedRoundButton,
                            ]}
                            onPress={() => handleRoundSelection(20)}
                        >
                            <Text style={styles.roundButtonText}>20</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {!isRunning && !isRoundsCompleted && (
                <Text variant="headlineSmall" style={styles.instructionText}>Click the button to begin</Text>
            )}
            {isRunning && !isRoundsCompleted && (
                <Text variant="headlineMedium" style={styles.instructionText}>{getInstructionsText(isRunning, isRoundsCompleted, counter)}</Text>
            )}
            {!isRunning && !isRoundsCompleted && (
                <Button
                    mode="contained"
                    onPress={startExercise}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    disabled={!selectedRound}
                >
                    Start
                </Button>
            )}
            {isRunning && !isRoundsCompleted && (
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.roundsText}>
                        Rounds: {currentRound} / {rounds}
                    </Text>
                    {(currentRound < rounds) && (
                        <Text style={styles.instructionText}>
                            {rounds - currentRound} more round(s) to go
                        </Text>
                    )}
                    {(currentRound == rounds) && (
                        <Text style={styles.instructionText}>
                            Almost there!
                        </Text>
                    )}
                </View>
            )}
            {isRoundsCompleted && (
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../../assets/claps.jpg')}
                        style={{ width: 200, height: 200, alignSelf: 'center' }}
                    />
                    <Text variant="headlineSmall" style={styles.modalTitle}>Well done!</Text>
                    <Text variant="titleMedium">Completed the breathing exercise</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    instructionText: {
        marginBottom: 20,
        textAlign: 'center',
    },
    counterText: {
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        marginBottom: 10,
    },
    buttonText: {
        fontWeight: 'bold',
    },
    roundsText: {
        marginBottom: 10,
    },
    modalTitle: {
        marginBottom: 20,
        color: 'black',
    },
    roundsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    roundButton: {
        backgroundColor: 'pink',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    selectedRoundButton: {
        backgroundColor: 'lightblue',
    },
    roundButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BreathingExercise;