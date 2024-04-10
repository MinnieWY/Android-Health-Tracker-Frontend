import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, Headline } from "react-native-paper";
import YoutubePlayer from "react-native-youtube-iframe";

const VideoMaterial = ({ material }) => {
    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            console.log("video has finished playing!");
        }
    }, []);

    function getVideoId(url: String) {
        const regExp =
            /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            return match[2];
        }
    }

    return (
        <ScrollView style={{ padding: 16 }}>
            <YoutubePlayer
                height={210}
                play={playing}

                videoId={getVideoId(material.url)}
                onChangeState={onStateChange}
            />
            <View>
                <Headline>{material.description}</Headline>
                <Text variant="bodyMedium" style={styles.mainText}>
                    {material.content}
                </Text>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mainText: {
        marginTop: 16,
        marginBottom: 16,
        lineHeight: 24,
    },
});


export default VideoMaterial;