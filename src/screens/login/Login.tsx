import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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

            const { data, metadata } = result as { data: UserDTO, metadata: any };

            await AsyncStorage.setItem('userId', JSON.stringify(data.id));

            dispatch(loginSuccess());
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error:', error);
            setError('An unexpected error occurred');
        }
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgetPassword');
    };
    const handleRegistration = () => {
        navigation.navigate('Registration');
    };

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
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Log In" onPress={handleLogin} />
            <Button title="Forgot Password" onPress={handleForgotPassword} />
            <Button title="Registration" onPress={handleRegistration} />
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

export default Login;