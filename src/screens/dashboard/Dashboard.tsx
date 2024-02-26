import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, Button, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { List } from 'react-native-paper';
import { MaterialListItemDTO } from '../../common/dto';

const Dashboard = (navigation) => {
    const [hrvData, setHrvData] = useState(null);
    const [stepsData, setStepsData] = useState(null);
    const [recommendedMaterials, setRecommendedMaterials] = useState([]);
    const [userPreference, setUserPreference] = useState(null);
    const [selectedPreference, setSelectedPreference] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch("http://192.168.0.159:8080/dashboard", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId
                    }),
                });

                const data = await response.json();
                setHrvData(data.hrv);
                setStepsData(data.steps);
            } catch (error) {
                console.error('Error fetching Dashboard data:', error);
            }
        };
        const fetchRecommendedMaterials = async () => {
            try {
                const preference = await AsyncStorage.getItem('userPreference');
                const userId = await AsyncStorage.getItem('userId');
                if (preference) {
                    const preferenceResponse = await fetch(
                        "http://192.168.0.159:8080/recommendation/recommended-materials", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId
                        }),
                    });
                    const data = await preferenceResponse.json();
                    const materialList: MaterialListItemDTO[] = data;
                    setRecommendedMaterials(materialList);
                } else {
                    setUserPreference(null);
                }
            } catch (error) {
                console.error('Error fetching recommended materials:', error);
            }
        };

        fetchDashboardData();
        if (userPreference != null) {
            fetchRecommendedMaterials();
        }
    }, [userPreference]);

    const handleUpdatePreference = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch('http://192.168.0.159:8080/recommendation/update-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    preference: selectedPreference
                }),
            });

            setUserPreference(selectedPreference);
        } catch (error) {
            console.error('Error updating preference:', error);
        }
    };

    const renderRecommendedMaterialItem = ({ item }) => (
        <TouchableOpacity
            key={item.id}
            style={styles.galleryItem}
            onPress={() => handleMaterialPress(item.id)}
        >
            <Text style={styles.galleryItemTitle}>{item.name}</Text>
        </TouchableOpacity>
    );

    const handleMaterialPress = (materialId) => {
        console.log('Material pressed:', materialId);
    };

    const handleViewAllMaterials = () => {
        navigation.navigate('RecommendationList');
    };

    return (
        <ScrollView style={styles.container}>
            {hrvData ? (
                <View style={styles.hrvDataContainer}>
                    <Text style={styles.hrvDataTitle}>HRV Information:</Text>
                    <LineChart
                        data={{
                            labels: Object.keys(hrvData).map(date => date.substring(5, 10)),
                            datasets: [
                                {
                                    data: Object.values(hrvData),
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 32} // Adjust the width as needed
                        height={220}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: '#f3f3f3',
                            backgroundGradientFrom: '#f3f3f3',
                            backgroundGradientTo: '#f3f3f3',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        bezier
                        style={styles.chart}
                    />
                </View>
            ) : (
                <Text style={styles.loadingText}>Loading HRV data...</Text>
            )}
            {stepsData ? (
                <View style={styles.stepsDataContainer}>
                    <Text style={styles.stepsDataTitle}>Steps Information:</Text>
                    <BarChart
                        data={{
                            labels: Object.keys(stepsData).map(date => date.substring(5, 10)),
                            datasets: [
                                {
                                    data: Object.values(stepsData),
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 70} // Adjust the width as needed
                        height={220}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: '#f3f3f3',
                            backgroundGradientFrom: '#f3f3f3',
                            backgroundGradientTo: '#f3f3f3',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        style={styles.chart}
                    />
                </View>
            ) : (
                <Text style={styles.loadingText}>Loading steps data...</Text>
            )}
            {/* Recommendation section */}
            <View style={styles.recommendationContainer}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                {userPreference === null ? (
                    <View style={styles.preferenceContainer}>
                        <Text style={styles.preferenceLabel}>Select your preference:</Text>
                        <Picker
                            selectedValue={selectedPreference}
                            onValueChange={(itemValue) => {
                                console.log('Selected preference:', itemValue);
                                setSelectedPreference(itemValue)
                            }}
                            style={styles.preferencePicker}
                        >
                            <Picker.Item label="Video" value="video" style={styles.preferenceLabel} />
                            <Picker.Item label="Article" value="article" style={styles.preferenceLabel} />
                            <Picker.Item label="Soundtrack" value="soundtrack" style={styles.preferenceLabel} />
                        </Picker>
                        <Button title="Update Preference" onPress={handleUpdatePreference} />
                    </View>
                ) : (
                    <FlatList
                        horizontal
                        data={recommendedMaterials}
                        renderItem={renderRecommendedMaterialItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                )}
            </View>
            <TouchableOpacity onPress={handleViewAllMaterials}>
                <Text>Check all avaiable materials</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    hrvDataContainer: {
        backgroundColor: '#f3f3f3',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    hrvDataTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    hrvDataValue: {
        fontSize: 16,
    },
    loadingText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    stepsDataContainer: {
        backgroundColor: '#f3f3f3',
        padding: 8,
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    stepsDataTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    recommendationContainer: {
        backgroundColor: '#f3f3f3',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    materialsListContainer: {
        backgroundColor: '#f3f3f3',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    preferenceContainer: {
        marginBottom: 16,
    },
    preferenceLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    preferencePicker: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 8,
    },
    updateButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    recommendedMaterialItem: {
        marginBottom: 8,
    },
    recommendedMaterialTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    recommendedMaterialDescription: {
        fontSize: 14,
    },
    galleryItem: {
        marginRight: 16,
    },
    galleryItemImage: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    galleryItemTitle: {
        fontSize: 14,
        marginTop: 8,
    },
});

export default Dashboard;