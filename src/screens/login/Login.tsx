import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../AuthContext';
import { UserDTO } from '../../common/dto';
import { serverURL } from '../../api/config';

const Login = ({ navigation }) => {
    const { setIsLoggedIn } = useContext(AuthContext);
    const dispatch = useDispatch();
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('P@ssw0rd');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${serverURL}login`, {
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
                        setLoading(false);
                        break;
                    default:
                        console.error('Unexpected error:', result.error);
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

    const handleForgotPassword = () => {
        navigation.navigate('ForgetPassword');
    };

    const windowWidth = Dimensions.get('window').width;
    const logoSize = windowWidth * 0.5; // Adjust the scaling factor as needed

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/app_logo.png')}
                style={{ width: logoSize, height: logoSize, alignSelf: 'center' }}
            />

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
            <Button onPress={handleLogin} style={styles.button} disabled={loading} >Login</Button>
            <Button onPress={handleForgotPassword} style={styles.button}>Forgot Password</Button>

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