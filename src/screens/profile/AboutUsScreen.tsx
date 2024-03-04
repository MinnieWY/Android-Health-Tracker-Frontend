import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const AboutUsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>About Us</Text>
            <Text style={styles.description}>
                Hi there! I am Minnie Shih, the developer of this Tack and Mon.
                I hope you enjoy in using this application to track and monitor your stress level.
                If you have any feedback, please feel free to find me on LinkedIn or GitHub.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
    },
});

export default AboutUsScreen;