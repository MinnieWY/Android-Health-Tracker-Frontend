import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../../common/dto';
import { Card, Paragraph, Title } from 'react-native-paper';

const ProfileScreen = () => {
    const [userInfo, setUserInfo] = useState<UserDTO | null>(null); // Set the initial state type as UserDTO|null

    useEffect(() => {
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
    if (userInfo === null) {
        return (<Text>Loading...</Text>)
    };

    return (
        <View>
            <Card>
                <Card.Content>
                    <Title>User Profile</Title>
                    <Paragraph>Name: {userInfo.username}</Paragraph>
                    <Paragraph>Email: {userInfo.email}</Paragraph>
                </Card.Content>
            </Card>
        </View>
    );
};

export default ProfileScreen;