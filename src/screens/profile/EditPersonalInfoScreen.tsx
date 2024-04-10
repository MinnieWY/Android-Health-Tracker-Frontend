import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput, Button, RadioButton, Provider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { serverURL } from '../../api/config';
import ErrorDialog from '../../utils/ErrorDialog';

const EditPersonalInfoScreen = ({ navigation, route }) => {
    const { username, email, height, weight, gender, preference } = route.params.userInfo;

    const [updatedUsername, setUpdatedUsername] = useState<string>(username);
    const [updatedEmail, setUpdatedEmail] = useState<string>(email);
    const [updatedHeight, setUpdatedHeight] = useState<number>(height);
    const [updatedWeight, setUpdatedWeight] = useState<number>(weight);
    const [updatedGender, setUpdatedGender] = useState<string>(gender);
    const [updatedPreference, setUpdatedPreference] = useState<string>(preference);
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [heightError, setHeightError] = useState('');
    const [weightError, setWeightError] = useState('');
    const [overallError, setOverallError] = useState('');


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

        if (isNaN(updatedHeight) || updatedHeight <= 0 || updatedHeight > 300) {
            isError = true;
            errorMessage += 'Height is required as a posotive number from 1 to 300';
            setHeightError('Missing height');
        }

        if (isNaN(updatedWeight) || updatedWeight <= 0 || updatedWeight > 300) {
            isError = true;
            errorMessage += 'Weight is required as a positive number from 1 to 300';
            setWeightError('Missing weight');
        }

        if (isError) {
            return;
        }

        try {
            const id = await AsyncStorage.getItem('userId');
            const response = await fetch(`${serverURL}editUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    username: updatedUsername,
                    email: updatedEmail,
                    height: updatedHeight,
                    weight: updatedWeight,
                    gender: updatedGender,
                    preference: updatedPreference,
                }),
            });
            const result = await response.json();
            if (result.error) {
                switch (result.error) {
                    case 'ERR_DUPLICATED_USERNAME':
                        setOverallError('Duplicated username found in system. Please choose another one.');
                        break;
                    case 'ERR_USER_VALID_FAILED':
                        setOverallError('Invalid user information');
                        break;
                    case 'ERR_SERVER_ERROR':
                        setOverallError('Server Error');
                        break;
                    default:
                        setOverallError('Server Error');
                        break;
                }
            } else {
                navigation.navigate('Profile Screen');
            }
        } catch (error) {
            console.error('Error in saving user information:', error);
        }
    };

    const handleDismissError = () => {
        setOverallError('');
    };

    return (
        <Provider>
            <ScrollView style={styles.container} >
                {overallError !== '' && <ErrorDialog error={overallError} onDismiss={handleDismissError} />}
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
                                <RadioButton value="female" />
                                <Text>Female</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton value="male" />
                                <Text>Male</Text>
                            </View>
                        </RadioButton.Group>
                    </View>
                    <TextInput
                        label="Height (cm)"
                        value={updatedHeight}
                        onChangeText={(text) => setUpdatedHeight(text)}
                        mode="outlined"
                        keyboardType="decimal-pad"
                        style={styles.input}
                    />
                    {heightError !== '' && <Text style={styles.errorText}>{heightError}</Text>}
                    <TextInput
                        label="Weight (kg)"
                        value={updatedWeight}
                        onChangeText={(text) => setUpdatedWeight(text)}
                        mode="outlined"
                        keyboardType="decimal-pad"
                        style={styles.input}
                    />
                    {weightError !== '' && <Text style={styles.errorText}>{weightError}</Text>}
                </View>
                <Text>Preference:</Text>
                <View>
                    <Picker
                        selectedValue={updatedPreference}
                        onValueChange={(itemValue, itemIndex) =>
                            setUpdatedPreference(itemValue)
                        }
                        prompt='Choose one from below'
                    >
                        <Picker.Item label="Article" value="article" style={{ fontSize: 18 }} />
                        <Picker.Item label="Video" value="video" style={{ fontSize: 18 }} />
                    </Picker>
                </View>
                <Button mode="contained" onPress={handleUpdate} style={styles.button}>
                    Update
                </Button>
            </ScrollView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
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


export default EditPersonalInfoScreen;