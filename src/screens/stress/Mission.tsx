import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';

const missions = [
    {
        id: 1,
        title: 'Deep Breathing',
        description: 'Try 4-7-8 Breathing with guided breathing exercises.',
    },
    {
        id: 2,
        title: 'Stretching',
        description: 'Let\'s move',
    },
    {
        id: 3,
        title: 'Mindfulness',
        description: 'Listen to your body saying.',
    },
    {
        id: 4,
        title: 'Connect with Others',
        description: 'Go out with friends or family.',
    },
];

const Mission = () => {
    return (
        <ScrollView>
            {missions.map((mission) => (
                <Card key={mission.id} style={styles.card}>
                    <Card.Title title={mission.title} />
                    <Card.Content>
                        <Text style={styles.missionDescription}>{mission.description}</Text>
                    </Card.Content>
                </Card>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    missionDescription: {
        fontSize: 14,
    },
});

export default Mission;