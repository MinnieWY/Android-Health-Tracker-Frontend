import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const EditPersonalInfoScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleUpdate = () => {
        const updateUserInfo = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(`http://192.168.0.159:8080/updateProfile/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        email,
                    }),
                });
                navigation.navigate('Profile');
            } catch (error) {
                console.error('Error in saving user information:', error);
            }
        };
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                mode="outlined"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleUpdate} style={styles.button}>
                Update
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
});

export default EditPersonalInfoScreen;