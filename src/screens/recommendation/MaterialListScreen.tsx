import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import { MaterialListItemDTO } from '../../common/dto';

const MaterialListScreen = ({ navigation }) => {
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        const fetchMaterialList = async () => {
            try {

                const response = await fetch("http://192.168.0.159:8080/recommendation/list", {
                    method: 'Get',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                const materialList: MaterialListItemDTO[] = data;
                setMaterials(materialList);
            } catch (error) {
                console.error('Error fetching Dashboard data:', error);
            }
        }
        fetchMaterialList();
    }, []);

    const handleMaterialPress = (materialid: String) => {
        navigation.navigate('Lesson', { materialId: materialid });

    };
    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                {materials.map((material) => (
                    <TouchableOpacity key={material.id} onPress={() => handleMaterialPress(material.id)}>
                        <Card key={material.id} style={styles.card}>
                            <Card.Content>
                                <Title>{material.name}</Title>
                                <Paragraph>Type: {material.type}</Paragraph>
                                <Paragraph>{material.shortDescription}</Paragraph>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    card: {
        marginBottom: 16,
    },
});
export default MaterialListScreen;