import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Searchbar, useTheme } from 'react-native-paper';

const CommunitySearch = ({ navigation }) => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://192.168.0.159:8080/query=${searchQuery}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.error) {
                console.error('Unexpected error in server:', result.error);
                setError('Server error');
            } else {
                const { data } = result;
                setSearchResults(data);
            }
        } catch (error) {
            console.error('Not catched error in Frontend:', error);
            setError('Server error');
        }
    };

    const navigateToPublicProfile = (userId) => {
        navigation.navigate('PublicProfile', { userId });
    };

    const renderListItem = ({ item }) => (
        <View style={styles.resultItem}>
            <TouchableOpacity onPress={navigateToPublicProfile}>
                <Text>{item.username}</Text>
                <Text>{item.email}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Searchbar
                placeholder="Search for users"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchBar}
                theme={theme}
            />
            {searchResults.length === 0 && searchQuery.trim() !== '' ?
                <Text>No results found. Please refine your search query.</Text>
                : null}
            <FlatList
                data={searchResults}
                renderItem={renderListItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchBar: {
        marginBottom: 16,
    },
    resultItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
});

export default CommunitySearch;