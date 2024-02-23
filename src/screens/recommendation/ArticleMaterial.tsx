import { View, Text } from "react-native";

const ArticleMaterial = ({ material }) => {
    return (
        <View>
            <Text>{material.content}</Text>
        </View>
    );
};

export default ArticleMaterial;