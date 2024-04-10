import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-native-paper';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { SleepDTO } from '../../common/dto';
import { serverURL } from '../../api/config';

const clock = require('../../assets/clock.png');
const efficiency = require('../../assets/H.png');
const sleep = require('../../assets/sleep.png');

const Sleep = () => {
    const [sleepData, setSleepData] = useState(null as SleepDTO | null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSleepData = async () => {
            try {
                setLoading(true);
                const userId = await AsyncStorage.getItem('userId');
                const response = await fetch(`${serverURL}dashboard/sleep`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId
                    }),
                });

                const result = await response.json();
                if (result.error) {
                    switch (result.error) {
                        case 'SLEEP_DATA_ABSENT':
                            setError('No sleep data found. Sync your device to get data.');
                            setLoading(false);
                            break;
                        case '':
                            setError('Connection failed with Fibit server. Please try again later.');
                            setLoading(false);
                            break;
                        default:
                            console.error('Unexpected error in server:', result.error);
                            setError('Server error');
                            setLoading(false);
                    }
                } else {
                    const { data } = result;
                    setSleepData(data);
                    setLoading(false);
                }

            } catch (error) {
                console.error('Error fetching Sleep data:', error);
            }
        }

        fetchSleepData();
    }, []);

    const convertTimeString = (timeString: string) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }


    const convertData = (data: SleepDTO) => {
        const displayData = [];

        const startTimeHour = convertTimeString(data.startTime);
        const endTimeHour = convertTimeString(data.endTime);

        // Duration
        displayData.push({
            name: 'Duration',
            status: data.sleepDuration,
            image: clock,
            lightColor: '#f8e4d9',
            color: '#fcf1ea',
            darkColor: '#fac5a4',
            needRing: false,
        });

        // Time
        displayData.push({
            name: 'Time',
            startTime: startTimeHour,
            endTime: endTimeHour,
            image: sleep,
            lightColor: '#d7f0f7',
            color: '#e8f7fc',
            darkColor: '#aceafc',
            needRing: false,
        });

        // Efficiency
        displayData.push({
            name: 'Efficiency',
            status: data.sleepEfficiency,
            image: efficiency,
            lightColor: '#dad5fe',
            color: '#e7e3ff',
            darkColor: '#8860a2',
            needRing: true,
        });
        return displayData;
    }


    return (
        <View>
            <Label>Your Sleep</Label>
            {!loading && sleepData && (
                <View style={{ flexDirection: 'row' }}>
                    {convertData(sleepData).map((item, index) => (
                        <CustomCard data={item} index={index} key={index} />
                    ))}
                </View>
            )}
            {!loading && error && (
                <Card>
                    <Card.Content>
                        <Text>{error}</Text>
                    </Card.Content>
                </Card>
            )}
        </View>


    );
};

export default Sleep;


const CustomCard = ({ data, index }) => {
    return (
        <View
            key={index}
            style={{
                flex: 1,
                height: index === 1 ? 180 : 150,
                padding: 10,
                alignSelf: 'center',
                backgroundColor: data.color,
                justifyContent: 'space-between',
                marginHorizontal: 8,
                borderRadius: 10,
                shadowColor: 'lightgrey',
                shadowOffset: { width: -5, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
            }}>
            <Image source={data.image} style={{ height: 25, width: 25 }} />
            {data.needRing && (
                <View style={{ alignSelf: 'center', margin: 5 }}>
                    <Progress.Circle
                        size={50}
                        progress={data.status / 100}
                        showsText
                        formatText={() => { return data.status + '%' }}
                        unfilledColor="#ededed"
                        borderColor="#ededed"
                        color={data.darkColor}
                        direction="counter-clockwise"
                        strokeCap="round"
                        thickness={5}
                        style={{
                            shadowColor: 'grey',
                            shadowOffset: { width: 2, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 1,
                        }}
                        textStyle={{
                            fontSize: 16,

                            fontWeight: 'bold',
                        }}
                    />
                </View>
            )}
            <View>
                {data.startTime && (
                    <Text style={{ fontSize: 10 }}>
                        {data.startTime} - {data.endTime}
                    </Text>
                )}
                {data.name === 'Duration' && (
                    <Text style={{ fontSize: 10 }}>
                        {data.status}
                    </Text>
                )}
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <Text >{data.name}</Text>

            </View>
        </View >
    );
};

const Label = ({ children }) => <Text style={styles.label}>{children}</Text>;
const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { paddingHorizontal: 10, flex: 1, justifyContent: 'center' },
    bigTitle: { fontSize: 16 },
    smallTitle: { fontSize: 10, opacity: 0.6 },
    image: { height: '100%', width: '100%' },
    fireImage: { height: 15, width: 15, alignSelf: 'center', margin: 5 },
    banner: {
        marginTop: 20,
        padding: 30,
        resizeMode: 'contain',
        borderRadius: 20,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    bannerContainer: { flex: 1 },
    label: { fontSize: 20, marginVertical: 10 },
    model: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 10,
        height: '75%',
        width: '50%',
        transform: [{ rotateY: '180deg' }],
    },
    imageContainer: {
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    screen: { margin: '3%' },
    offer: { color: 'white', fontSize: 10 },
    offerText: { color: 'white', fontSize: 16 },

    rowLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fireContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});