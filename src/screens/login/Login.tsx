import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../AuthContext';
import { UserDTO } from '../../common/dto';

const Login = ({ navigation }) => {
    const { setIsLoggedIn } = useContext(AuthContext);
    const dispatch = useDispatch();
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('P@ssw0rd');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        try {
            const response = await fetch('http://192.168.0.159:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            const result = await response.json();

            if (result.error) {
                switch (result.error) {
                    case 'ERR_PASSWORD_MISMATCHED':
                        setError('Username does not match with password');
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

    const handleForgotPassword = () => {
        navigation.navigate('ForgetPassword');
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                mode="outlined"
            />
            <TextInput
                label="Password"
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                mode="outlined"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button onPress={handleLogin} style={styles.button} >Login</Button>
            <Button onPress={handleForgotPassword} style={styles.button}>Forgot Password</Button>
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
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
    button: {
        backgroundColor: 'pink',
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 24,
    }
});

export default Login;