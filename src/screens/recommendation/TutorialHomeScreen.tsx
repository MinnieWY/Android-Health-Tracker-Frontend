import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card } from 'react-native-paper';
import { MaterialListItemDTO } from '../../common/dto';

const TutorialHomeScreen = ({ navigation }) => {
    const [recommendedMaterials, setRecommendedMaterials] = useState([]);
    const [userPreference, setUserPreference] = useState(null);
    const [selectedPreference, setSelectedPreference] = useState(null);

    useEffect(() => {
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
            onPress={() => handleMaterialPress(item.id)}
        >
            <Card>
                <Card.Content>
                    <Text style={styles.recommendedMaterialTitle}>{item.name}</Text>
                    <Text style={styles.recommendedMaterialDescription}>{item.shortDescription}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    const handleMaterialPress = (materialId) => {
        console.log('Material pressed:', materialId);
    };

    const handleViewAllMaterials = () => {
        navigation.navigate('MaterialList');
    };

    return (
        <ScrollView>
            < View >
                <Text style={styles.sectionTitle}>Recommendations</Text>
                {
                    userPreference === null ? (
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
                    )
                }
            </View >
            <TouchableOpacity onPress={handleViewAllMaterials}>
                <Text>Check all avaiable materials</Text>
            </TouchableOpacity>
        </ScrollView >
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
});

export default TutorialHomeScreen;