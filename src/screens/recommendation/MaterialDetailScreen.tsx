import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ArticleMaterial from './ArticleMaterial';
import VideoMaterial from './VideoMaterial';
import { Headline } from 'react-native-paper';
import { MaterialItemDTO } from '../../common/dto';
import { serverURL } from '../../api/config';

const MaterialDetailScreen = ({ route }) => {
    const [material, setMaterial] = useState<MaterialItemDTO>();
    const { materialId } = route.params;

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const response = await fetch(`${serverURL}recommendation/${materialId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data: MaterialItemDTO = await response.json();
                setMaterial(data);
            } catch (error) {
                console.error('Error fetching material:', error);
            }
        }
        fetchMaterial();
    }, [materialId]);

    let MaterialComponent = null;
    if (material) {
        switch (material.type) {
            case 'video':
                MaterialComponent = VideoMaterial;
                break;
            case 'article':
                MaterialComponent = ArticleMaterial;
                break;
            default:
                MaterialComponent = () => (
                    <View>
                        <Text>Unsupported material type.</Text>
                    </View>
                );
                break;
        }
    }

    return (
        <View style={styles.container}>
            {material && (
                <>
                    <Headline>{material.name}</Headline>
                    <MaterialComponent material={material} />
                </>
            )}
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