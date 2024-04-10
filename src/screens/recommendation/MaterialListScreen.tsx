import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Card, Icon, IconButton, Paragraph, Title } from 'react-native-paper';
import { MaterialListItemDTO } from '../../common/dto';
import { serverURL } from '../../api/config';
const MaterialListScreen = ({ navigation }) => {
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        const fetchMaterialList = async () => {
            try {

                const response = await fetch(`${serverURL}recommendation/list`, {
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
                                <IconButton icon={material.type == "video" ? "video" : material.type == "article" ? "script-text-outline" : "microphone"} color={'#000000'} size={20} />
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