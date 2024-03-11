import React, { useEffect, useState } from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../../common/dto';
import { Card, Divider, Drawer, Headline, List, Paragraph, Title, TextInput, Portal, Button, Provider, Avatar, Dialog, DefaultTheme } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ProfileScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState<UserDTO | null>(null);
    const [visible, setVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(`http://192.168.0.159:8080/${userId}`);
                const result = await response.json();

                const { data, metadata } = result as { data: UserDTO, metadata: any };
                setUserInfo(data);
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
        navigation.navigate('Personal Information');
    };

    const handleNavigateToAboutUs = () => {
        navigation.navigate('About Us');
    };

    const handleShowDialog = () => {
        setVisible(true);
    };

    const handleHideDialog = () => {
        setVisible(false);
    };

    const handleExistingPasswordChange = (text) => {
        setCurrentPassword(text);
    };

    const handleNewPasswordChange = (text) => {
        setNewPassword(text);
    };

    return (
        <Provider theme={DefaultTheme}>
            <ScrollView style={styles.container}>
                <Card>
                    <TouchableOpacity onPress={handleNavigateToPersonalInfo}>
                        <Card.Content>
                            <Avatar.Icon size={50} icon="account" style={styles.avatar} />
                            <Title>Welcome back, {userInfo.username}!</Title>
                            <Paragraph>{userInfo.email}</Paragraph>
                        </Card.Content>
                    </TouchableOpacity>
                </Card>
                <View style={styles.communityContainer}>
                    <Headline>Community</Headline>
                    <Card>
                        <TouchableOpacity onPress={handleNavigateToCommunity}>
                            <Card.Cover source={require('../../assets/community.jpg')} />
                            <Card.Content>
                                <Title>Connect with your friends</Title>
                            </Card.Content>
                        </TouchableOpacity>
                    </Card>
                </View>
                <Drawer.Section>
                    <TouchableOpacity onPress={handleShowDialog}>
                        <List.Item
                            title="Change Password"
                            left={() => <List.Icon icon="lock" />}
                        />
                    </TouchableOpacity>
                    <Divider />
                    <List.Item
                        title="About Us"
                        left={() => <List.Icon icon="information" />}
                        onPress={handleNavigateToAboutUs}
                    />
                </Drawer.Section>

                <Portal>
                    <Dialog visible={visible} onDismiss={handleHideDialog}>
                        <Dialog.Title>Change Password</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Current Password"
                                value={currentPassword}
                                onChangeText={handleExistingPasswordChange}
                                secureTextEntry
                                style={styles.input}
                            />
                            <TextInput
                                label={"New Password"}
                                value={newPassword}
                                onChangeText={handleNewPasswordChange}
                                secureTextEntry
                                style={styles.input}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleHideDialog}>Save</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ScrollView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    communityContainer: {
        marginTop: 20,
    },
    avatar: {
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
    },
});

export default ProfileScreen;