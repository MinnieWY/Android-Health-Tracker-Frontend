import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';

const BreathingIntro = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
            <Image
                source={require('../../assets/breath_banner.jpg')}
                style={styles.bannerImage}
            />
            <Text style={styles.title}>Breathing Exercise</Text>
            <Text style={styles.description}>
                Take a moment to relax and focus on your breath. This breathing exercise can help reduce stress and promote a sense of calmness.
            </Text>
            <Text style={styles.sectionTitle}>Steps to go through</Text>
            <Text style={styles.instructions}>
                1. Find a comfortable sitting or lying position.
            </Text>
            <Text style={styles.instructions}>
                2. Close your eyes and take a deep breath in through your nose, filling your lungs with air.
            </Text>
            <Text style={styles.instructions}>
                3. Slowly exhale through your mouth, letting go of any tension or stress.
            </Text>
            <Text style={styles.instructions}>
                4. Repeat this deep breathing pattern for several minutes, focusing on the sensation of your breath entering and leaving your body.
            </Text>
            <Text style={styles.instructions}>
                5. When you're ready, open your eyes and gently bring your attention back to the present moment.
            </Text>
            <Text style={styles.sectionTitle}>Preparation</Text>
            <Text style={styles.listItem}>A quiet and peaceful space</Text>
            <Button mode="contained" onPress={() => navigation.navigate('Exercise')}>Start</Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    bannerImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionText: {
        fontSize: 16,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
    },
    instructions: {
        fontSize: 14,
        marginBottom: 8,
    },
    listItem: {
        fontSize: 14,
        marginBottom: 8,
    },
});

export default BreathingIntro;