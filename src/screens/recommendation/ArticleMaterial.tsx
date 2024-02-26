import { View, Text, TouchableOpacity } from "react-native";
import { Card, Headline, Paragraph, Title } from "react-native-paper";
import Clipboard from '@react-native-clipboard/clipboard';

const ArticleMaterial = ({ material }) => {
    const copyToClipboard = () => {
        Clipboard.setString(material.url);
    };

    return (
        <View>
            <Text>{material.content}</Text>
            <Card>
                <Card.Content>
                    <Title>More about the {material.name}</Title>
                    <Paragraph>The above content is extracted from {material.url}</Paragraph>
                    <TouchableOpacity onPress={copyToClipboard}>
                        <Text>Click here to copy to Clipboard and know about it</Text>
                    </TouchableOpacity>
                </Card.Content>
            </Card>
        </View>
    );
};

export default ArticleMaterial;