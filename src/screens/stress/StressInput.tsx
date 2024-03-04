import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { Modal, View, Button } from "react-native";
import DatePickerModal from 'react-native-datepicker-modal';

const StressInput = ({ isVisible, onClose, onDateChange, onStressLevelChange }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [stressLevel, setStressLevel] = useState(5);

    const handleStressLevelChange = (value) => {
        setStressLevel(value);
    };


    const handleDateChange = (date) => {
        setSelectedDate(date);
        onDateChange(date);
    };

    const handleStressLevelChange = (value) => {
        setStressLevel(value);
        onStressLevelChange(value);
    };

    return (
        <Modal visible={isVisible} animationType="slide">
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Pick a Date</Text>
                <DatePickerModal
                    mode="date"
                    date={selectedDate}
                    onDateChanged={setSelectedDate}
                    presentationStyle="calendar"
                />
                <Text style={styles.sliderLabel}>Stress Level: {stressLevel}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={stressLevel}
                    onValueChange={handleStressLevelChange}
                />
                <Button mode="contained" onPress={onClose}>
                    Save
                </Button>
            </View>
        </Modal>
    );
};
export default StressInput;