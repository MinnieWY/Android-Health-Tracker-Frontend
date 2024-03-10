import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

const EditPersonalInfoScreen = ({ navigation, route }) => {
    const { username, email, age, height, weight, gender, preference } = route.params.userData;
    const [updatedUsername, setUpdatedUsername] = useState(username);
    const [updatedEmail, setUpdatedEmail] = useState(email);
    const [updatedAge, setUpdatedAge] = useState(age);
    const [updatedHeight, setUpdatedHeight] = useState(height);
    const [updatedWeight, setUpdatedWeight] = useState(weight);
    const [updatedGender, setUpdatedGender] = useState(gender);
    const [updatedPreference, setUpdatedPreference] = useState(preference);
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [heightError, setHeightError] = useState('');
    const [weightError, setWeightError] = useState('');

    const preferenceItems = [
        { label: 'Article', value: 'Article' },
        { label: 'Audio', value: 'Audio' },
        { label: 'Video', value: 'Video' },
    ];

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleUpdate = async () => {
        let isError = false;
        let errorMessage = '';

        if (updatedUsername.trim() === '') {
            isError = true;
            errorMessage += 'Username is required';
            setUsernameError('Missing username');
        } else {
            setUsernameError('');
        }

        if (updatedEmail.trim() === '') {
            isError = true;
            errorMessage += 'Email is required';
            setEmailError('Missing email');
        } else if (!isValidEmail(updatedEmail)) {
            isError = true;
            errorMessage += 'Email is invalid';
            setEmailError('Invalid email');
        } else {
            setEmailError('');
        }

        if (updatedAge.trim() === '') {
            isError = true;
            errorMessage += 'Age is required';
            setEmailError('Missing age');
        } else if (isNaN(updatedAge) || parseInt(updatedAge) <= 0) {
            isError = true;
            errorMessage += 'Age must be a positive integer from 0 to 105';
            setEmailError('Invalid age');
        }

        if (updatedHeight.trim() === '') {
            isError = true;
            errorMessage += 'Height is required. ';
            setHeightError('Missing height');
        } else if (isNaN(updatedHeight) || parseFloat(updatedHeight) <= 0 || !(/^\d+(\.\d{1,2})?$/.test(updatedHeight))) {
            isError = true;
            errorMessage += 'Height must be a positive number with at most 2 d.p.';
            setHeightError('Invalid height');
        }

        if (updatedWeight.trim() === '') {
            isError = true;
            errorMessage += 'Weight is required. ';
            setWeightError('Missing weight');
        } else if (isNaN(updatedWeight) || parseFloat(updatedWeight) <= 0 || !(/^\d+(\.\d{1,2})?$/.test(updatedWeight))) {
            isError = true;
            errorMessage += 'Weight must be a positive number with at most 2 d.p.';
            setWeightError('Invalid weight');
        }

        if (isError) {
            return;
        }

        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(`http://192.168.0.159:8080/updateProfile/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: updatedUsername,
                    email: updatedEmail,
                    age: updatedAge,
                    height: updatedHeight,
                    weight: updatedWeight,
                    gender: updatedGender,
                }),
            });
            const result = await response.json();
            if (result === 'success') {
                navigation.navigate('Profile');
            }
        } catch (error) {
            console.error('Error in saving user information:', error);
        }
    };

    return (
        <ScrollView>
            <Text style={styles.title}>Edit Profile</Text>
            <View>
                <TextInput
                    label="Username"
                    value={updatedUsername}
                    onChangeText={(text) => setUpdatedUsername(text)}
                    mode="outlined"
                    style={styles.input}
                />
                {usernameError !== '' && <Text style={styles.errorText}>{usernameError}</Text>}
                <TextInput
                    label="Email"
                    value={updatedEmail}
                    onChangeText={(text) => setUpdatedEmail(text)}
                    mode="outlined"
                    keyboardType="email-address"
                    style={styles.input}
                />
                {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}
            </View>
            <View>
                <View style={styles.radioContainer}>
                    <Text>Gender:</Text>
                    <RadioButton.Group onValueChange={(value) => setUpdatedGender(value)} value={updatedGender}>
                        <View style={styles.radioOption}>
                            <Text>Female</Text>
                            <RadioButton value="female" />
                        </View>
                        <View style={styles.radioOption}>
                            <Text>Male</Text>
                            <RadioButton value="male" />
                        </View>
                    </RadioButton.Group>
                </View>
                <TextInput
                    label="Age"
                    value={updatedAge}
                    onChangeText={(text) => setUpdatedAge(text)}
                    mode="outlined"
                    keyboardType="number-pad"
                    style={styles.input}
                />
                <TextInput
                    label="Height (cm)"
                    value={updatedHeight}
                    onChangeText={(text) => setUpdatedHeight(text)}
                    mode="outlined"
                    keyboardType="decimal-pad"
                    style={styles.input}
                />
                <TextInput
                    label="Weight (kg)"
                    value={updatedWeight}
                    onChangeText={(text) => setUpdatedWeight(text)}
                    mode="outlined"
                    keyboardType="decimal-pad"
                    style={styles.input}
                />
            </View>
            <View>
                <RNPickerSelect
                    value={updatedPreference}
                    onValueChange={(value) => setUpdatedPreference(value)}
                    placeholder={{ label: 'Select your preference', value: null }}
                    items={preferenceItems}
                    style={pickerSelectStyles}
                />
            </View>
            <Button mode="contained" onPress={handleUpdate} style={styles.button}>
                Update
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
});

export default EditPersonalInfoScreen;