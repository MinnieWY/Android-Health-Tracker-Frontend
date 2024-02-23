import { useLayoutEffect, useRef, useState } from "react";
import { View, Text } from "react-native";

const VideoMaterial = ({ material }) => {
    const [videoHeight, setVideoHeight] = useState(0);
    const galleryRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        setVideoHeight((galleryRef.current?.offsetWidth ?? 0) * 0.65); // 4:3
    }, [galleryRef.current?.offsetWidth]);

    return (
        <View>
            <iframe
                src={material.url}
                title="Video player"
                width="100%"
                height={`${videoHeight}px`}
                allow="accelerometer; 
                      autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
            <Text>Description: {material.description}</Text>
        </View>
    );
};

export default VideoMaterial;