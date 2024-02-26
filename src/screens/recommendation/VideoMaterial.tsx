import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { View, Text, Button } from "react-native";
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
        <View>
            <YoutubePlayer
                height={300}
                play={playing}

                videoId={getVideoId(material.url)}
                onChangeState={onStateChange}
            />
            <Text>{material.description}</Text>
        </View>
    );
};

export default VideoMaterial;