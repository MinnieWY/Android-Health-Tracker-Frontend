import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Divider, Icon, Title } from 'react-native-paper';

const AboutUsScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Image
                source={require('../../assets/logo.png')}
                style={styles.bannerImage}
            />
            <Text style={styles.description}>
                Hi there! I am Minnie Shih, the developer of this Tack and Mon.
                I hope you enjoy in using this application to track and monitor your stress level.
                If you have any feedback, please feel free to find me on LinkedIn or GitHub.
            </Text>
            <Card>
                <Card.Content>
                    <Title>Contact Me</Title>
                    <Text><Icon source="linkedin" size={20} />LinkedIn: Minnie Shih</Text>
                    <Text><Icon source="github" size={20} /> GitHub: WY Minnie</Text>
                </Card.Content>
            </Card>
            <Divider />
            <View>
                <Text>Attribution</Text>
                <Text>Part of image is made by Freepik from www.flaticon.com</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    description: {
        fontSize: 16,
    },
    bannerImage: {
        width: '100%',
        height: 350,
        resizeMode: 'cover',
        marginBottom: 16,
    },
});

export default AboutUsScreen;