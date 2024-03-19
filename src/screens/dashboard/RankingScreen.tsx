import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar, Banner, Text, Provider, Card } from "react-native-paper";
import ErrorDialog from "../../utils/ErrorDialog";
import { BMIDTO } from "../../common/dto";

const RankingScreen = ({ navigation }) => {
    const [error, setError] = useState("");
    const [rankingData, setRankingData] = useState(null);
    const [profileCompleted, setProfileCompleted] = useState(false);
    const [BMIData, setBMIData] = useState(null);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                const response = await fetch("http://192.168.0.159:8080/ranking", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                    }),

                });

                const result = await response.json();
                if (result.error) {
                    console.error("Unexpected error:", result.error);
                    setError("Server error");
                } else {
                    const { data } = result;
                    setRankingData(data);
                }
            } catch (error) {
                console.error("Error fetching Ranking data:", error);
            }
        };

        const fetchBMI = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                const response = await fetch("http://192.168.0.159:8080/dashboard/BMI", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                    }),
                });

                const result = await response.json();
                if (result.error) {
                    if (result.error === "Profile not completed") {
                        console.error("Catched error:", result.error);
                        setProfileCompleted(false);
                    } else if (result.error === "BMI_INVALID") {
                        console.error("Catched error:", result.error);
                        setError("There is issue in your profile data. Visit the Profile Screen to update your information");
                    } else {
                        console.error("here");
                        console.error("Unexpected error:", result.error);
                        setError("Server error");
                    }

                } else {
                    const { data } = result as { data: BMIDTO };
                    setBMIData(data);
                }
            } catch (error) {
                console.error("Error fetching BMI data:", error);
            }

        };

        //fetchRanking();
        fetchBMI();

    }, []);


    const handleDismissError = () => {
        setError("");
        navigation.navigate("Dashboard");
    };

    return (
        <Provider>
            <ScrollView>
                {error !== "" && (
                    <ErrorDialog error={error} onDismiss={handleDismissError} />
                )}

                {!profileCompleted && (
                    <Banner style={styles.banner} visible={true}>
                        <Text style={styles.bannerText}>Fill in your profile to get your BMI calculated</Text>
                        <Text style={styles.bannerText}>Visit the Profile Screen to update your information</Text>
                    </Banner>
                )}
                {profileCompleted && BMIData && (
                    <View style={styles.bodyContainer}>

                        <Text style={styles.bmiLabel}>BMI</Text>
                        <Text style={styles.bmiValue}>{BMIData.bmi}</Text>
                        <Text style={styles.bmiValue}>{BMIData.category}</Text>

                        <View style={styles.progressBarContainer}>
                            <ProgressBar
                                progress={BMIData.bmi / 30} // Assuming the maximum BMI is 35
                                color="#6200ee"
                                style={styles.progressBar}
                            />
                        </View>
                    </View>
                )}

                {rankingData && (
                    <>
                        <ChartItem
                            label="Resting Heart Rate"
                            data={rankingData?.restingHeartRate}
                        />
                        <ChartItem label="LF" data={rankingData?.lf} />
                        <ChartItem label="HF" data={rankingData?.hf} />
                        <ChartItem label="RMSSD" data={rankingData?.rmssd} />
                    </>
                )}
            </ScrollView>
        </Provider>
    );
};

const ChartItem = ({ label, data }) => {
    return (
        <View style={styles.chartItem}>
            <Text style={styles.chartLabel}>{label}</Text>
            <ProgressBar
                progress={data}
                color="#6200ee"
                style={styles.progressBar}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: "red",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    bannerText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    chartItem: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    chartLabel: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: "bold",
    },
    progressBar: {
        height: 10,
    },
    bodyContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 32,
    },
    bodyImage: {
        width: 200,
        height: 400,
    },
    bmiLabel: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 16,
    },
    bmiValue: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 8,
    },
    progressBarContainer: {
        width: "80%",
        marginTop: 16,
    },
});

export default RankingScreen;