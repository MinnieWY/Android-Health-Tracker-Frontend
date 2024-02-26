import React, { useLayoutEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { WebView } from 'react-native-webview';

const VideoMaterial = ({ material }) => {
    const [videoHeight, setVideoHeight] = useState(0);
    const galleryRef = useRef(null);

    const handleLayout = () => {
        galleryRef.current?.measure((x, y, width) => {
            if (width) {
                setVideoHeight(width * 0.65); // 4:3 aspect ratio
            }
        });
    };

    useLayoutEffect(() => {
        handleLayout();
    }, []);


    return (
        <View ref={galleryRef} onLayout={handleLayout}>
            {videoHeight > 0 && (
                <WebView
                    source={{ uri: material.url }}
                    style={{ width: "100%", height: videoHeight }}
                />
            )}
            <Text>Description: {material.description}</Text>
        </View>
    );
};

export default VideoMaterial;