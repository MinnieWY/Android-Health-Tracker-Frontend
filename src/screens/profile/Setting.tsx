import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const Setting = () => {
    const navigation = useNavigation();

    const openMenu = () => {
        navigation.dispatch(DrawerActions.openDrawer()); // Open the menu drawer
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
                <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.header}>
                <Image source={require('../../assets/logo.png')} style={styles.profilePicture} />
                <Text style={styles.username}>John Doe</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>johndoe@gmail.com</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Phone:</Text>
                    <Text style={styles.infoValue}>+1 123 456 7890</Text>
                </View>
                {/* Add more info items as needed */}
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    menuButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: 'bold',
        marginRight: 8,
    },
    infoValue: {
        flex: 1,
    },
    button: {
        backgroundColor: '#ff0000',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default Setting;