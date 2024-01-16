import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Linking } from 'react-native';
import axios from 'axios';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const Registration = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        setError('');
        // // Call the backend API to perform registration
        // fetch('https://364f-161-81-184-27.ngrok-free.app/register', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         username: "username"
        //     }),
        // })
        //     .then((response) => response.text())
        //     .then((responseString) => {
        //         const [authorizationUrl, userId] = responseString.split(',');
        //         console.log(authorizationUrl, userId);
        //         // Cannot use webview as it do not support rendering OAuth authorization flows. Use device's default web browser instead.
        //         //Linking.openURL(authorizationUrl);
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //         setError('An unexpected error occurred');
        //     });
        try {
            // Call the backend API to perform registration
            const response = await axios.post('https://364f-161-81-184-27.ngrok-free.app/register', {
                username: username,
            });

            const [authorizationUrl, userId] = response.data.split(',');

            // Open the authorization URL in the in-app browser
            const result = await InAppBrowser.openAuth(authorizationUrl, 'ht2024://callback');

            // Continue with the registration process after authentication
            // You can handle the authentication result here and navigate to the appropriate screen

            // For example, if the authentication is successful, you can navigate to the main tabs
            if (result.type === 'success') {
                navigation.navigate('MainTabs');
            } else {
                // Handle other result types (e.g., 'cancel' or 'dismiss')
                // Show an error message or perform any other necessary actions
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An unexpected error occurred');
        }
    };
    //navigation.navigate('MainTabs');

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Gender"
                value={gender}
                onChangeText={setGender}
            />
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
});

export default Registration;