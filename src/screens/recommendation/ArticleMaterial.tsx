import { View, Text, StyleSheet } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";
import ChatBubble from 'react-native-chat-bubble';

const ArticleMaterial = ({ material }) => {

    return (
        <View>
            <ChatBubble
                isOwnMessage={true}
                bubbleColor='#1084ff'
                tailColor='#1084ff'
                withTail={true}
                style={{ marginBottom: 10 }}
            >
                <Text>{material.shortDescription}</Text>
            </ChatBubble>
            <Text>{material.content}</Text>
            <Card style={styles.infoBox}>
                <Card.Content>
                    <Title>More about the {material.name}</Title>
                    <Paragraph>The above content is extracted from {material.url}</Paragraph>
                    <Text>Search on the internet to know more about the topic</Text>
                </Card.Content>
            </Card>
        </View>
    );
};


const styles = StyleSheet.create({
    infoBox: {

    },

});
export default ArticleMaterial;