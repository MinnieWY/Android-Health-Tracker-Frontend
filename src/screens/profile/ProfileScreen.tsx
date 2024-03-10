import React, { useEffect, useState } from 'react';
import { Text, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../../common/dto';
import { Card, Divider, Drawer, Headline, List, Paragraph, Title, Modal, Portal, Button } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ProfileScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState<UserDTO | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(`http://192.168.0.159:8080/${userId}`);
                const result = await response.json();
                if (result.ok) {
                    const { data, metadata } = result as { data: UserDTO, metadata: any };
                    setUserInfo(data);
                } else {
                    const { error, metadata } = result;
                    console.error('Error:', error);
                }
            } catch (error) {
                console.error('Unexpected Error:', error);
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

    const handleNavigateToPersonalInfo = () => {
        navigation.navigate('PersonalInfo');
    };

    const handleNavigateToAboutUs = () => {
        navigation.navigate('AboutUs');
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const hideModal = () => {
        setIsModalVisible(false);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    return (
        <ScrollView>
            <Card>
                <TouchableOpacity onPress={handleNavigateToPersonalInfo}>
                    <Card.Content>
                        <Title>{userInfo.username}</Title>
                        <Paragraph>{userInfo.email}</Paragraph>
                    </Card.Content>
                </TouchableOpacity>
            </Card>
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
                    title="Change Password"
                    left={() => <List.Icon icon="lock" />}
                    onPress={showModal}
                />
                <Divider />
                <List.Item
                    title="About Us"
                    left={() => <List.Icon icon="information" />}
                    onPress={handleNavigateToAboutUs}
                />
            </Drawer.Section>

            <Portal>
                <Modal visible={isModalVisible} onDismiss={hideModal}>
                    <Card>
                        <Card.Title title="Change Password" />
                        <Card.Content>
                            <TextInput
                                label="Current Password"
                                value={password}
                                onChangeText={handleExistingPasswordChange}
                                secureTextEntry
                            <TextInput
                                label="New Password"
                                value={password}
                                onChangeText={handleNewPasswordChange}
                                secureTextEntry
                            />
                            <Button mode="contained" onPress={hideModal}>
                                Save
                            </Button>
                        </Card.Content>
                    </Card>
                </Modal>
            </Portal>
        </ScrollView>
    );
};

export default ProfileScreen;