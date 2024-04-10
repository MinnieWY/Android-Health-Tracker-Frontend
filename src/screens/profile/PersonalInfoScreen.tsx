import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { UserInfoDTO } from "../../common/dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { serverURL } from "../../api/config";

const PersonalInfoScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = React.useState<UserInfoDTO | null>(null);

    React.useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                const response = await fetch(
                    `${serverURL}userInfo/${userId}`
                );
                const result = await response.json();
                if (result.error) {
                    console.error("Error fetching user information:", result.error);
                    return;
                } else {
                    const { data } = result as { data: UserInfoDTO };
                    setUserInfo(data);
                }

            } catch (error) {
                console.error("Error fetching user information:", error);
            }
        };
        fetchUserInfo();
    }, []);

    const handleEditProfile = () => {
        navigation.navigate("Edit Personal Information", {
            userInfo
        });
    };

    return (
        <View style={styles.container}>
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
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Point</Text>
                            <Text style={styles.infoValue}>{userInfo.point}</Text>
                        </View>
                    </View>
                </ScrollView>
            )}
            <IconButton
                icon="pencil"
                onPress={handleEditProfile}
                style={{ position: 'absolute', top: 10, right: 10 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
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