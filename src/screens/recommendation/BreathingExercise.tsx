import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

const BreathingExercise = () => {
    const [counter, setCounter] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [rounds, setRounds] = useState(1);
    const [currentRound, setCurrentRound] = useState(1);
    const [isRoundsCompleted, setIsRoundsCompleted] = useState(false);


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
        if (counter === 4) {
            setBackgroundColor('#FFCDD2');
        } else if (counter === 11) {
            setBackgroundColor('#BBDEFB');
        } else if (counter === 18) {
            setBackgroundColor('#C8E6C9');
        }

        if (counter === 18 && currentRound < rounds) {
            setCounter(0);
            setCurrentRound((prevRound) => prevRound + 1);
        }

        if (counter === 18 && currentRound === rounds) {
            setIsRoundsCompleted(true);
        }
    }, [counter, currentRound, rounds]);

    const handleRoundSelection = (selectedRounds: number) => {
        setRounds(selectedRounds);
    };

    const getInstructionsText = (isRunning, isCompleted, counter) => {
        if (!isRunning && !isCompleted) {
            return 'Click on the "Start" button to begin the breathing exercise';
        } else if (isRunning) {
            if (counter < 4) {
                return `Take a deep breath in ${18 - counter}`;
            } else if (counter < 11) {
                return `Hold your breath in ${11 - (counter - 4)}`;
            } else {
                // counter < 18
                return `Release your breath slowly in ${18 - (counter - 11)}`;
            }
        } else {
            return 'Congratulations! You have completed the breathing exercise';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {!isRunning && !isRoundsCompleted && (
                <View>
                    <Text style={styles.modalTitle}>Select Number of Rounds</Text>
                    <View style={styles.roundsContainer}>
                        <TouchableOpacity
                            style={styles.roundButton}
                            onPress={() => handleRoundSelection(3)}
                        >
                            <Text style={styles.roundButtonText}>3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.roundButton}
                            onPress={() => handleRoundSelection(5)}
                        >
                            <Text style={styles.roundButtonText}>5</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.roundsContainer}>
                        <TouchableOpacity
                            style={styles.roundButton}
                            onPress={() => handleRoundSelection(10)}
                        >
                            <Text style={styles.roundButtonText}>10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.roundButton}
                            onPress={() => handleRoundSelection(20)}
                        >
                            <Text style={styles.roundButtonText}>20</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <Text style={styles.instructionText}>{getInstructionsText(isRunning, isRoundsCompleted, counter)}</Text>

            {!isRunning && (
                <Button
                    mode="contained"
                    onPress={startExercise}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    Start
                </Button>
            )}
            {isRunning && !isRoundsCompleted && (
                <View>
                    <Text style={styles.roundsText}>
                        Rounds: {currentRound} / {rounds}
                    </Text>
                    {(currentRound / rounds) > 0.5 && (
                        <Text style={styles.instructionText}>
                            {rounds - currentRound} more rounds to go
                        </Text>
                    )}
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
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    counterText: {
        fontSize: 40,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    roundsText: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
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
    roundButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BreathingExercise;