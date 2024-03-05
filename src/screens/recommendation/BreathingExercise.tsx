import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

const BreathingExercise = () => {
    const [counter, setCounter] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [rounds, setRounds] = useState(1);
    const [currentRound, setCurrentRound] = useState(1);
    const [isRoundsCompleted, setIsRoundsCompleted] = useState(false);
    const [showModal, setShowModal] = useState(true);

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
        setShowModal(false);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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

    const continueExercise = () => {
        setCurrentRound((prevRound) => prevRound + 1);
        setIsRoundsCompleted(false);
    };

    const handleRoundSelection = (selectedRounds) => {
        setRounds(selectedRounds);
        setShowModal(false);
    };

    const getInstructionsText = (isRunning, isCompleted, counter) => {
        if (!isRunning && !isCompleted) {
            return 'Click on the "Start" button to begin the breathing exercise';
        } else if (isRunning) {
            if (counter < 4) {
                return 'Take a deep breath in';
            } else if (counter < 11) {
                return 'Hold your breath';
            } else {
                // counter < 18
                return 'Release your breath slowly';
            }
        } else {
            // Should evaluate to isCompleted
            return 'Congrualtion! You have completed the breathing exercise';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Modal visible={showModal} animationType="fade" transparent>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Number of Rounds</Text>
                    <View style={styles.roundsContainer}>
                        <TouchableOpacity
                            style={styles.roundButton}
                            onPress={() => handleRoundSelection(1)}
                        >
                            <Text style={styles.roundButtonText}>1 (Have a taste)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.roundButton}
                            onPress={() => handleRoundSelection(3)}
                        >
                            <Text style={styles.roundButtonText}>3 (Short exercise)</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.roundsContainer}>
                        <TouchableOpacity
                            style={styles.roundButton}
                            onPress={() => handleRoundSelection(5)}
                        >
                            <Text style={styles.roundButtonText}>5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.roundButton}
                            onPress={() => handleRoundSelection(10)}
                        >
                            <Text style={styles.roundButtonText}>10</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Text style={styles.instructionText}>{getInstructionsText(isRunning, isRoundsCompleted, counter)}</Text>
            <Text style={styles.counterText}>{formatTime(counter)}</Text>
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
            {isRunning && (
                <Text style={styles.roundsText}>
                    Rounds: {currentRound} / {rounds}
                </Text>
            )}
            {isRoundsCompleted && (
                <View>
                    <Button
                        mode="contained"
                        onPress={continueExercise}
                        style={styles.button}
                        labelStyle={styles.buttonText}
                    >
                        Start a new set of exercise
                    </Button>
                </View>
            )}
            {isRunning && (
                counter === 18 && (
                    <Text style={styles.instructionText}>
                        {rounds - currentRound} more rounds to go
                    </Text>
                )
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFFFFF',
    },
    roundsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    roundButton: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    roundButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BreathingExercise;