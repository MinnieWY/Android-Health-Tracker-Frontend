import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ArticleMaterial from './ArticleMaterial';
import SoundtrackMaterial from './SoundtrackMaterial';
import VideoMaterial from './VideoMaterial';
import { Headline } from 'react-native-paper';


const MaterialDetailScreen = ({ route }) => {
    const [material, setMaterial] = useState({});
    const { materialId } = route.params;

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const response = await fetch(`http://192.168.0.159:8080/recommendation/material/{materialId}`);
                const data = await response.json();
                setMaterial(data);
            } catch (error) {
                console.error('Error fetching material:', error);
            }
        }
        fetchMaterial();
    }, []);

    let MaterialComponent;
    switch (material.type) {
        case 'video':
            MaterialComponent = VideoMaterial;
            break;
        case 'article':
            MaterialComponent = ArticleMaterial;
            break;
        case 'soundtrack':
            MaterialComponent = SoundtrackMaterial;
            break;
        default:
            MaterialComponent = () => (
                <View>
                    <Text>Unsupported material type.</Text>
                </View>
            );
    }

    return (
        <View style={styles.container}>
            <Headline>{material.name}</Headline>
            <MaterialComponent material={material} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});

export default MaterialDetailScreen;