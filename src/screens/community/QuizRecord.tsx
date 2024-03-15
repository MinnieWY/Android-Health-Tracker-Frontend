
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Text } from "react-native-paper";
import ErrorDialog from "../../utils/ErrorDialog";

const QuizRecord = ({ route, navigation }) => {
    const theme = useTheme();
    const [error, setError] = useState("");
    const { question, date, points, explaination, correctAnswer } = route.params;

    if (question === undefined || date === undefined || points === undefined || explaination === undefined || correctAnswer === undefined) {
        setError("Invalid data");
    }

    const handleDismissError = () => {
        setError("");
        navigation.navigate("Quiz");
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {error !== "" && (
                <ErrorDialog error={error} onDismiss={handleDismissError} />
            )}
            <Text>{question}</Text>
            <Text>Date: {date}</Text>
            <Text>Correct Answer: {correctAnswer}</Text>
            <Text>Points: {points}</Text>
            <Text>{explaination}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


export default QuizRecord;