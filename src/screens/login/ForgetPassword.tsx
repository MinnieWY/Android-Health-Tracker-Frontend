import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/actions';
import AuthContext from '../../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../../common/dto';

const ForgetPassword = ({ navigation }) => {
    const { setIsLoggedIn } = useContext(AuthContext);
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleForgetPassword = async () => {
        try {
            const response = await fetch('http://192.168.0.159:8080/forget-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    newPassword,
                }),
            });
            const result = await response.json();
            if (result.error) {
                switch (result.error) {
                    case 'ERR_USER_NOT_FOUND':
                        setError('Account not found');
                        break;
                    default:
                        console.error('Unexpected error:', result.error);
                        setError('Server error');
                }
            } else {
                const { data } = result as { data: UserDTO };
                await AsyncStorage.setItem('userId', JSON.stringify(data.id));
                dispatch(loginSuccess());
                setIsLoggedIn(true);
            }

        } catch (error) {
            console.error('Not catched error in Frontend:', error);
            setError('Server error');
        }
    };


    return (
        <View style={styles.container}>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
            />
            <TextInput
                label="New Password"
                mode="outlined"
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                secureTextEntry
            />
            <Button mode="contained" onPress={handleForgetPassword} style={styles.button}>
                Submit
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 8,
    },
    button: {
        marginTop: 20,
    },
});

export default ForgetPassword;