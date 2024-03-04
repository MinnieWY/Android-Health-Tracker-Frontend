import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { FriendDTO } from '../../common/dto';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendScreen = ({ userId }) => {
    const [friendInfo, setFriendInfo] = useState<FriendDTO | null>(null);
    const [isFriend, setIsFriend] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`http://192.168.0.159:8080/${userId}`);
                const data: FriendDTO = await response.json();
                setFriendInfo(data);
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        };

        fetchUserInfo();
    }, []);
    if (friendInfo === null) {
        return (<Text>Loading...</Text>)
    };

    const handleFriendAction = async () => {
        const payload = {
            currentUserId: await AsyncStorage.getItem('userId'),
            targetFriendId: friendInfo.id,
        };

        if (friendInfo.isFriend) {
            try {
                await fetch('http://192.168.0.159:8080/removeFriend/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                setIsFriend(false);
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        } else {
            try {
                await fetch('http://192.168.0.159:8080/addFriend/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                setIsFriend(true);
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        }
    };
    return (
        <View>
            <Card>
                <Card.Content>
                    <Title>User Profile</Title>
                    <Paragraph>Name: {friendInfo.username}</Paragraph>
                    <Paragraph>Email: {friendInfo.email}</Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={handleFriendAction}>
                        {friendInfo.isFriend ? 'Remove Friend' : 'Add Friend'}
                    </Button>
                </Card.Actions>
            </Card>
        </View>
    );
};

export default FriendScreen;