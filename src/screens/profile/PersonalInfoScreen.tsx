import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { UserInfoDTO } from "../../common/dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

const PersonalInfoScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = React.useState<UserInfoDTO | null>(null);

    React.useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                const response = await fetch(
                    `http://192.168.0.159:8080/userInfo/${userId}`
                );
                const data: UserInfoDTO = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error("Error fetching user information:", error);
            }
        };
        fetchUserInfo();
    }, []);

    const handleEditProfile = () => {
        navigation.navigate("EditPersonalInfo", {
            userInfo
        });
    };

    return (
        <View>
            <IconButton
                icon="pencil"
                onPress={handleEditProfile}
                style={{ position: 'absolute', top: 10, right: 10 }}
            />
            <Text style={styles.title}>Personal Info</Text>
            {userInfo && (
                <ScrollView>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Account Information</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Username</Text>
                            <Text style={styles.infoValue}>{userInfo.username}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{userInfo.email}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Gender</Text>
                            <Text style={styles.infoValue}>{userInfo.gender}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Age</Text>
                            <Text style={styles.infoValue}>{userInfo.age}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Height (cm)</Text>
                            <Text style={styles.infoValue}>{userInfo.height}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Weight (kg)</Text>
                            <Text style={styles.infoValue}>{userInfo.weight}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Preference</Text>
                            <Text style={styles.infoValue}>{userInfo.preference}</Text>
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoLabel: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    infoValue: {
        flex: 1,
    },
});

export default PersonalInfoScreen;