import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMedicines } from '../api/api';

export default function MedicineListScreen({ navigation }) {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const loadMedicines = async (query = '') => {
        try {
            setErrorMessage('');
            const response = await getMedicines(query);
            if (response.data.success) {
                setMedicines(response.data.data);
            } else {
                setErrorMessage('Could not load medicines.');
            }
        } catch (error) {
            setErrorMessage('Failed to connect to the server. Check your internet connection.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Reload the list every time this screen comes into focus,
    // so it updates after adding, editing, or deleting a medicine
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            loadMedicines(searchText);
        }, [])
    );

    const handleSearch = (text) => {
        setSearchText(text);
        loadMedicines(text);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadMedicines(searchText);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemCard}
            onPress={() => navigation.navigate('MedicineDetail', { medicineId: item.id })}
        >
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>
                    {item.generic_name} - {item.strength}
                </Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <Text style={styles.itemPrice}>PHP {item.price}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by name, generic name, or category"
                value={searchText}
                onChangeText={handleSearch}
            />

            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <FlatList
                data={medicines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No medicines found.</Text>
                }
                contentContainerStyle={medicines.length === 0 ? styles.emptyList : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 12,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 15,
    },
    itemCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    itemSubtitle: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    itemCategory: {
        fontSize: 12,
        color: '#2563eb',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '600',
        color: '#16a34a',
    },
    errorText: {
        color: '#dc2626',
        textAlign: 'center',
        marginBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94a3b8',
        marginTop: 40,
    },
    emptyList: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});