import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

const CommunitySearch = () => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = () => {
        fetch(`http://192.168.0.159:8080/search?query=${searchQuery}`)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
                console.log("searched", searchResults);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const renderListItem = ({ item }) => (
        <View style={styles.resultItem}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
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