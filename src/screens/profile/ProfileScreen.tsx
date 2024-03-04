import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../../common/dto';
import { Avatar, Card, Divider, Drawer, Headline, List, Paragraph, Title } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ProfileScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState<UserDTO | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(`http://192.168.0.159:8080/${userId}`);
                const data: UserDTO = await response.json();
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

    const handleNavigateToCommunity = () => {
        navigation.navigate('Community');
    };

    const handleNavigateToEditPersonalInfo = () => {
        navigation.navigate('EditPersonalInfo');
    };

    const handleNavigateToAboutUs = () => {
        navigation.navigate('AboutUs');
    }

    return (
        <ScrollView>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Avatar.Text label="JD" size={100} />
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{userInfo.username}</Text>
                <Text style={{ fontSize: 16 }}>{userInfo.email}</Text>
                <Text style={{ fontSize: 16 }}>You enjoy a lot in {userInfo.preference}</Text>
            </View>
            <Headline>Community</Headline>
            <Card>
                <TouchableOpacity onPress={handleNavigateToCommunity}>
                    <Card.Content>
                        <Title>Connect with your friends</Title>
                    </Card.Content>
                </TouchableOpacity>
            </Card>
            <Divider />
            <Drawer.Section>
                <List.Item
                    title="Update Personal Information"
                    left={() => <List.Icon icon="account-edit" />}
                    onPress={handleNavigateToEditPersonalInfo}
                />
                <Divider />
                <List.Item
                    title="About Us"
                    left={() => <List.Icon icon="information" />}
                    onPress={handleNavigateToAboutUs}
                />
            </Drawer.Section>
        </ScrollView>
    );
};

export default ProfileScreen;