import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const ForgetPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');


    const handleForgetPassword = () => {
        // // Call the backend API to perform login
        // fetch('http://your-backend-api/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         username,
        //         password,
        //     }),
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if (data.success) {
        //             // Login successful, navigate to the dashboard screen
        //             navigation.navigate('Dashboard');
        //         } else {
        //             // Login failed, display the error message
        //             setError(data.error);
        //         }
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //         setError('An unexpected error occurred');
        //     });
        console.log('Login successful');
    };

    return (
        <View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Button title="Submit" onPress={handleForgetPassword} />
        </View>
    );
};

export default ForgetPassword;