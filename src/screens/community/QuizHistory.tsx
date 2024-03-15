import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { List, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { QuizHistoryListItemDTO } from "../../common/dto";
import { ScrollView } from "react-native-gesture-handler";
import ErrorDialog from "../../utils/ErrorDialog";

const QuizHistory = (navigation) => {
    const theme = useTheme();
    const [error, setError] = useState("");
    const [quizHistory, setQuizHistory] = useState<QuizHistoryListItemDTO[]>([]);

    useEffect(() => {
        const fetchQuizHistory = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                const response = await fetch(`http://quiz/record/user//${userId}`);
                const result = await response.json();

                if (result.error) {
                    console.error("Unexpected error:", result.error);
                    setError("Server error");

                } else {
                    const { data } = result as { data: QuizHistoryListItemDTO[] };
                    setQuizHistory(data);
                }
            } catch (error) {
                console.error("Not caught error in Frontend:", error);
                setError("Server error");
            }
        };

        fetchQuizHistory();
    }, []);

    const handleDismissError = () => {
        setError("");
        navigation.navigate("Quiz");
    };


    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            {error !== "" && (
                <ErrorDialog error={error} onDismiss={handleDismissError} />
            )}
            <List.Section>
                <List.Subheader style={{ color: theme.colors.primary }}>Quiz Record</List.Subheader>
                {quizHistory.map((record, index) => (
                    <List.Item
                        key={index}
                        title={record.question}
                        description={record.date}
                        right={(props) => (
                            <List.Item
                                style={{ flex: 1, alignItems: "flex-end" }}
                                title={`+${record.points}`}
                                {...props}
                            />
                        )}
                        left={() => (
                            <List.Icon
                                icon={record.isCorrect ? "check-decagram" : "close-circle-outline"}
                            />
                        )}
                        onPress={() => { navigation.navigate("QuizHistoryDetail", { record }) }}
                    />
                ))}
            </List.Section>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default QuizHistory;