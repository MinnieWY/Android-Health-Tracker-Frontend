import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Dimensions, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import ErrorDialog from '../../utils/ErrorDialog';
import { useRoute } from '@react-navigation/native';
import { serverURL } from '../../api/config';

const ShareScreen = ({ navigation }) => {
    const route = useRoute();
    const { date, steps } = route.params;
    const [imageData, setImageData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchImage();
    }, []);

    const fetchImage = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            const startDate = new Date(date);
            const response = await fetch(`${serverURL}dashboard/sharing`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    steps: 12191,
                    startDate: startDate.toLocaleDateString('en-GB'),
                }),
            });

            const result = await response.json();
            if (result.error) {
                console.error("Unexpected error:", result.error);
                setError("Server error");
            } else {
                const { data } = result;
                setImageData(data);
            }
        } catch (error) {
            console.error("Error fetching Share Image:", error);
        }
    };

    const saveImageToDisk = async (base64Data) => {
        try {
            const fileUri = FileSystem.cacheDirectory + 'share_image.jpg';
            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return fileUri;
        } catch (error) {
            console.error("Error saving image to disk:", error);
            return null;
        }
    };

    const handleShare = async () => {
        if (imageData) {
            const fileURL = saveImageToDisk(imageData);
            if (!fileURL) {
                console.error("Error saving image to disk");
                return;
            }
            try {
                const shareOptions = {
                    mimeType: 'image/jpeg',
                    dialogTitle: 'Share the image',
                    UTI: 'image/jpeg',
                };
                await Sharing.shareAsync(await fileURL, shareOptions);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const screenWidth = Dimensions.get('window').width * 0.7;
    const screenHeight = Dimensions.get('window').height * 0.8;

    return (
        <ScrollView>
            {/* {error !== "" && <ErrorDialog error={error} onDismiss={() => { setError(''); navigation.navigate("Dashboard") }} />} */}
            <View style={styles.container}>
                <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                    <Text style={styles.shareButtonText}>Save / Share</Text>
                </TouchableOpacity>


                {imageData && (
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${imageData}` }}
                        resizeMode="contain"
                        style={[styles.image, { width: screenWidth, height: screenHeight }]}
                    />
                )}

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    shareButton: {
        alignSelf: 'flex-end',
    },
    shareButtonText: {
        fontSize: 18,
    },
    image: {
        alignSelf: 'center',
    },
});

export default ShareScreen;