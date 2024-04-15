import { ScrollView, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar, Banner, Text, Provider, ActivityIndicator } from "react-native-paper";
import { BMIDTO } from "../../common/dto";
import { serverURL } from "../../api/config";
import { RefreshControl } from "react-native-gesture-handler";

const BMI = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [profileCompleted, setProfileCompleted] = useState(false);
    const [BMIData, setBMIData] = useState(null as BMIDTO | null);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {

        fetchBMI();

    }, []);

    const fetchBMI = async () => {
        try {
            setLoading(true);
            setError("");
            const userId = await AsyncStorage.getItem("userId");
            const response = await fetch(`${serverURL}dashboard/BMI`, {
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
                if (result.error === "PROFILE_NOT_COMPLETE") {
                    setError("Fill in your profile to get your BMI calculated");
                    setProfileCompleted(false);
                    setLoading(false);
                } else if (result.error === "BMI_INVALID") {
                    setError("There is an issue in your profile data. Visit the Profile Screen to update your information");
                    setProfileCompleted(true);
                    setLoading(false);
                } else {
                    console.error("Unexpected error:", result.error);
                    setError("Server error for BMI data");
                    setLoading(false);
                }

            } else {
                const { data } = result as { data: BMIDTO };
                setProfileCompleted(true);
                setBMIData(data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching BMI data:", error);
        }

    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            fetchBMI();
            setRefreshing(false);
        }, 2000);
    };

    return (
        <Provider>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing}
                    onRefresh={onRefresh} />
            } >
                {loading && (
                    <View>
                        <ActivityIndicator animating={true} size="large" color={'blue'} />
                        <Text style={{ fontSize: 20, textAlign: 'center' }} >Loading BMI...</Text>
                    </View>)}
                {!loading && error !== "" && (
                    <Banner style={styles.banner} visible={true}>
                        <Text style={styles.bannerText}>{error}</Text>
                    </Banner>
                )}
                {!loading && profileCompleted && BMIData && (
                    <View style={styles.bodyContainer}>
                        <Text style={styles.bmiLabel}>Body Mass Information</Text>
                        <Text style={styles.bmiValue}>{BMIData.bmi}</Text>
                        <Text style={styles.bmiValue}>{BMIData.bmiCategory}</Text>

                        <View style={styles.progressBarContainer}>
                            <ProgressBar
                                progress={BMIData.bmi / 30} // Assuming the maximum BMI is 35
                                color="#6200ee"
                                style={styles.progressBar}
                            />
                        </View>

                        <Text style={styles.bmiValue}>You are top {BMIData.bmiRanking}% in the population</Text>
                    </View>
                )}

            </ScrollView>
        </Provider>
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
        marginTop: 8,
    },
    progressBarContainer: {
        width: "80%",
        marginTop: 16,
    },
});

export default BMI;