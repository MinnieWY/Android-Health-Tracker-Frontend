import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import { UserSearchResultDTO } from '../../common/dto';
import { Searchbar } from 'react-native-paper';

const CommunitySearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResultDTO[]>([]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = () => {
        fetch(`http://192.168.0.159:8080/search?query=${searchQuery}`)
            .then((response) => response.json())
            .then((data: UserSearchResultDTO[]) => {
                setSearchResults(data);
                console.log("searched", searchResults);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    console.log("length", searchResults.length);
    const renderListItem = ({ item }) => (
        <View style={styles.resultItem}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search for friends and family"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchBar}
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