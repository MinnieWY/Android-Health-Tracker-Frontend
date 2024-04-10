import { View, StyleSheet, TouchableOpacity, Linking, Image, Dimensions } from "react-native";
import { Divider, Text } from "react-native-paper";

const ArticleMaterial = ({ material }) => {

    const handleReadMore = () => {
        const url = material.url;
        Linking.openURL(url);
    };


    return (
        <View>
            <Divider />
            {material.name == "Shall We Talk" && (
                <Image
                    source={require('../../assets/shall_we_talk_logo.png')}
                    style={{ alignSelf: 'center', marginTop: 16 }}
                />
            )}
            <Text style={styles.mainText} variant="bodyMedium">{material.content}</Text>
            <Divider />
            <TouchableOpacity onPress={handleReadMore}>
                <View style={styles.memoContainer}>
                    <Text variant="bodySmall" style={styles.memoText}>Read More in original platform</Text>
                    <Text variant="bodySmall" style={styles.memoText}>Credit to:{material.url}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    mainText: {
        marginTop: 16,
        marginBottom: 16,
        lineHeight: 24,
    },
    memoContainer: {
        backgroundColor: '#F0F0F0',
        padding: 8,
        borderRadius: 8,
    },
    memoText: {
        color: '#333333',
    },
});
export default ArticleMaterial;