import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/actions';
import AuthContext from '../../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../../common/dto';
import { serverURL } from '../../api/config';

const ForgetPassword = ({ navigation }) => {
    const { setIsLoggedIn } = useContext(AuthContext);
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgetPassword = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${serverURL}forget-password`, {
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
                    case 'ERR_NOT_FOUND':
                        setError('Account not found');
                        setLoading(false);
                        break;
                    default:
                        console.error('Unexpected error in server:', result.error);
                        setError('Server error');
                        setLoading(false);
                }
            } else {
                const { data } = result as { data: UserDTO };
                await AsyncStorage.setItem('userId', JSON.stringify(data.id));
                dispatch(loginSuccess());
                setLoading(false);
                setIsLoggedIn(true);
            }

        } catch (error) {
            console.error('Not catched error in Frontend:', error);
            setError('Server error');
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Text variant='bodyMedium'>Fill the following form to reset the password</Text>
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

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {loading && (
                <View>
                    <ActivityIndicator animating={true} size="large" color={'blue'} />
                    <Text style={{ fontSize: 20, textAlign: 'center' }} >Loading ...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    button: {
        marginTop: 20,
    },
    input: {
        height: 40,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
});

export default ForgetPassword;