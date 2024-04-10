import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon, RadioButton } from 'react-native-paper';
import { QuestionDTO, QuestionResultDTO } from '../../common/dto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverURL } from '../../api/config';

const QuizScreen = () => {
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchQuestionFromServer();
    }, []);

    const fetchQuestionFromServer = async () => {
        try {
            const response = await fetch(`${serverURL}/quiz/question'`);
            const result = await response.json();

            if (result.error) {
                switch (result.error) {
                    case 'ERR_NOT_FOUND':
                        setError('Today question not yet ready');
                        break;
                    default:
                        console.error('Unexpected error:', result.error);
                        setError('Server error');
                }
            } else {
                const { data } = result as { data: QuestionDTO };
                setQuestion(data);
            }
        } catch (error) {
            console.error('Not catched error in Frontend:', error);
            setError('Server error');
        }
    };

    const submitAnswer = async () => {
        try {
            const userId = AsyncStorage.getItem('userId');
            const response = await fetch(`${serverURL}/quiz/question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    quizId: question.id,
                    answer: selectedOption,
                }),

            });
            const result = await response.json();

            if (result.error) {
                switch (result.error) {
                    case 'ERR_NOT_FOUND':
                        setError('Today question not yet ready');
                        break;
                    default:
                        console.error('Unexpected error:', result.error);
                        setError('Server error');
                }
            } else {
                const { data } = result as { data: QuestionResultDTO };
                setIsAnswered(true);
                setIsCorrect(data.isCorrect);
                setExplanation(data.explanation);
            }
        } catch (error) {
            console.error('Not catched error in Frontend:', error);
            setError('Server error');
        }
    };

    const renderOptions = () => {
        return question.options.map((option, index) => (
            <RadioButton.Item
                key={index}
                label={option}
                value={option}
                status={selectedOption === option ? 'checked' : 'unchecked'}
                onPress={() => setSelectedOption(option)}
                style={{ marginBottom: 10 }}
                labelStyle={{ fontSize: 16 }}
            />
        ));
    };

    const renderResult = () => {
        return (
            <View>
                <Icon source={isCorrect ? 'check-decagram' : 'close-circle-outline'} size={100} />
                <Text>Explanation: {explanation}</Text>
            </View>
        );
    };

    return (
        <View>
            {question ? (
                <View>
                    <Text>{question.text}</Text>
                    {renderOptions()}
                    <Button mode="contained" onPress={submitAnswer}>
                        Submit
                    </Button>
                </View>
            ) : (
                <View>
                    <Icon source="loading" size={100} />
                    <Text>Loading question...</Text>
                </View>
            )}
            {isAnswered && renderResult()}
        </View>
    );
};

export default QuizScreen;