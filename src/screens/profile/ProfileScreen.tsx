import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../../common/dto';

const ProfileScreen = () => {
    const [userInfo, setUserInfo] = useState<UserDTO | null>(null); // Set the initial state type as UserDTO|null

    useEffect(() => {
        // Fetch the user information from the backend using the stored user id
        const fetchUserInfo = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                // Make a request to the backend user endpoint with the userId as a path variable
                const response = await fetch(`http://192.168.0.159:8080/${userId}`);
                const data: UserDTO = await response.json(); // Parse the fetched data as UserDTO
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <View style={styles.container}>
            {userInfo ? (
                <>
                    <Text style={styles.label}>Username: {userInfo.username}</Text>
                    <Text style={styles.label}>Email: {userInfo.email}</Text>
                </>
            ) : (
                <Text>Loading user information...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default ProfileScreen;