import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

    const stopExercise = () => {
        setIsRunning(false);
    };

    const resetExercise = () => {
        setCounter(0);
        setBackgroundColor('#FFFFFF');
        setCurrentRound(1);
        setIsRoundsCompleted(false);
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

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.instructionText}>
                Follow the 4-7-8 breathing exercise:
            </Text>
            <Text style={styles.counterText}>{formatTime(counter)}</Text>
            {!isRunning ? (
                <Button
                    mode="contained"
                    onPress={startExercise}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    Start
                </Button>
            ) : (
                <Button
                    mode="contained"
                    onPress={stopExercise}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    Stop
                </Button>
            )}
            <Button
                mode="outlined"
                onPress={resetExercise}
                style={styles.button}
                labelStyle={styles.buttonText}
            >
                Reset
            </Button>
            <Text style={styles.roundsText}>
                Rounds: {currentRound} / {rounds}
            </Text>
            {counter === 4 && (
                <Text style={styles.instructionText}>Hold your breath</Text>
            )}
            {counter === 11 && (
                <Text style={styles.instructionText}>Release your breath</Text>
            )}
            {isRoundsCompleted ? (
                <View>
                    <Text style={styles.instructionText}>
                        Congratulation! You have completed {rounds} rounds of deep breathing
                    </Text>
                    <Button
                        mode="contained"
                        onPress={continueExercise}
                        style={styles.button}
                        labelStyle={styles.buttonText}
                    >
                        Continue
                    </Button>
                </View>
            ) : (
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
});

export default BreathingExercise;