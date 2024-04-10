import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../../common/dto';
import { Card, Divider, Drawer, Headline, List, Text, Title, TextInput, Portal, Button, Provider, Avatar, Dialog, DefaultTheme } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { serverURL } from '../../api/config';

const ProfileScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState<UserDTO | null>(null);
    const [visible, setVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [updatePasswordError, setUpdatePasswordError] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(`${serverURL}${userId}`);
                const result = await response.json();

                const { data, metadata } = result as { data: UserDTO, metadata: any };
                setUserInfo(data);
            } catch (error) {
                console.error('Unexpected Error:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const updatePassword = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(`${serverURL}changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    currentPassword,
                    newPassword,
                }),
            });
            const result = await response.json();
            console.log('Result:', result);
            if (result.error) {
                switch (result.error) {
                    case 'ERR_PASSWORD_MISMATCHED':
                        setUpdatePasswordError('Invalid current password');
                        break;
                    case 'ERR_USER_NOT_FOUND':
                        setUpdatePasswordError('User not found');
                        break;
                    default:
                        console.error('Error in server when updating password:', result.error);
                        setUpdatePasswordError('Server Error');
                }
            } else {
                setVisible(false);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setUpdatePasswordError('Error updating password');
        }
    };

    if (userInfo === null) {
        return (<Text>Loading...</Text>)
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
        setCurrentPassword('');
        setNewPassword('');
        setUpdatePasswordError('');
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
                            <Text variant="labelLarge">{userInfo.email}</Text>
                        </Card.Content>
                    </TouchableOpacity>
                </Card>
                <View style={styles.communityContainer}>
                    <Headline>Let's Talk</Headline>
                    <Card>

                        <Card.Cover source={require('../../assets/community.jpg')} />
                        <Card.Content>
                            <Title>Connect with your friends</Title>
                        </Card.Content>

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
                            {updatePasswordError !== '' && <Text style={{ color: 'red' }}>{updatePasswordError}</Text>}
                            <Button onPress={handleHideDialog}>Cancel</Button>
                            <Button onPress={updatePassword} disabled={!currentPassword && !newPassword}>Save</Button>
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