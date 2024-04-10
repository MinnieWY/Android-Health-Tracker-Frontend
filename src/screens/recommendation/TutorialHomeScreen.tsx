import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialListItemDTO } from '../../common/dto';
import { serverURL } from '../../api/config';

const TutorialHomeScreen = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const cardWidth = windowWidth * 0.5;

    const [recommendedMaterials, setRecommendedMaterials] = useState([]);
    const [hightlightMaterials, setHightlightMaterials] = useState([]);

    useEffect(() => {
        const fetchRecommendedMaterials = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(
                    `${serverURL}recommendation/recommended-materials`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId
                    }),
                });
                const data = await response.json();
                const materialList: MaterialListItemDTO[] = data;
                setRecommendedMaterials(materialList);
            } catch (error) {
                console.error('Error fetching recommended materials:', error);
            }
        };

        const fetchHightlightMaterials = async () => {
            try {
                const response = await fetch(
                    `${serverURL}recommendation/highlight`);
                const data = await response.json();
                const materialList: MaterialListItemDTO[] = data;
                setHightlightMaterials(materialList);
            } catch (error) {
                console.error('Error fetching hightlight materials:', error);
            }
        };

        fetchRecommendedMaterials();
        fetchHightlightMaterials();
    }, []);

    const renderRecommendedMaterialItem = ({ item }) => (
        <TouchableOpacity
            key={item.id}
            onPress={() => handleMaterialPress(item.id)}
            style={styles.recommendedMaterialItem}
        >
            <Card style={[styles.card, { width: cardWidth }]}>
                <Card.Content>
                    <Text style={styles.recommendedMaterialTitle}>{item.name}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    const handleMaterialPress = (materialId) => {
        navigation.navigate('Lesson', { materialId });
    };

    const handleViewAllMaterials = () => {
        navigation.navigate('Available Materials');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Exclusive For You</Text>
                <FlatList
                    horizontal
                    data={recommendedMaterials}
                    renderItem={renderRecommendedMaterialItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.sectionTitle}>Editor's Pick</Text>
                    <TouchableOpacity onPress={handleViewAllMaterials}>
                        <Text style={styles.checkAllText}>Check all</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    horizontal
                    data={hightlightMaterials}
                    renderItem={renderRecommendedMaterialItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Breathing Exercuse</Text>
                <Card>
                    <TouchableOpacity onPress={() => navigation.navigate('What is Breathing Exercise?')}>
                        <ImageBackground source={require('../../assets/breath_banner.jpg')} style={styles.cardCover}>
                            <Card.Content>
                                <Text>Take a moment to focus on your breathing</Text>
                            </Card.Content>
                        </ImageBackground>
                    </TouchableOpacity>
                </Card>
            </View>
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
    materialsListContainer: {
        backgroundColor: '#f3f3f3',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    sectionContainer: {
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
        marginRight: 10,
    },
    recommendedMaterialTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    recommendedMaterialDescription: {
        fontSize: 14,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkAllText: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    cardCover: {
        height: 200,
        justifyContent: 'flex-end',
    },
    card: {
        height: 100,
        marginBottom: 10,
    },
});

export default TutorialHomeScreen;