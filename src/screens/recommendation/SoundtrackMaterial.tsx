import { View, Text } from "react-native";

const SoundtrackMaterial = ({ material }) => {
    return (
        <View>
            <Text>Description: {material.description}</Text>
        </View>
    );
};

export default SoundtrackMaterial;