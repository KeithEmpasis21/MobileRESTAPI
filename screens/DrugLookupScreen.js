import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { searchDrugInfo } from '../api/openFdaApi';

export default function DrugLookupScreen() {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSearch = async () => {
        if (!searchText.trim()) {
            return;
        }

        setLoading(true);
        setSearched(true);
        setErrorMessage('');

        try {
            const response = await searchDrugInfo(searchText.trim());
            setResults(response.data.results || []);
        } catch (error) {
            setResults([]);
            if (error.response && error.response.status === 404) {
                setErrorMessage('No drug found with that name. Try a common brand name like Advil or Tylenol.');
            } else {
                setErrorMessage('Failed to fetch drug information. Check your internet connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        const brandName = item.openfda?.brand_name?.[0] || 'Unknown';
        const genericName = item.openfda?.generic_name?.[0] || 'Not available';
        const manufacturer = item.openfda?.manufacturer_name?.[0] || 'Not available';
        const purpose = item.purpose?.[0] || item.indications_and_usage?.[0] || 'Not available';
        const warnings = item.warnings?.[0] || 'No warnings listed';

        return (
            <View style={styles.card}>
                <Text style={styles.brandName}>{brandName}</Text>
                <Text style={styles.genericName}>{genericName}</Text>

                <InfoRow label="Manufacturer" value={manufacturer} />
                <InfoRow label="Purpose" value={purpose} truncate />
                <InfoRow label="Warnings" value={warnings} truncate />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Drug Information Lookup</Text>
            <Text style={styles.subtitle}>Search live data from the openFDA public database</Text>

            <View style={styles.searchRow}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="e.g. Advil, Tylenol, Aspirin"
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
            )}

            {!loading && errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {!loading && !errorMessage && searched && results.length === 0 && (
                <Text style={styles.emptyText}>No results found.</Text>
            )}

            <FlatList
                data={results}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

function InfoRow({ label, value, truncate }) {
    const displayValue = truncate && value.length > 150
        ? value.substring(0, 150) + '...'
        : value;

    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{displayValue}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
    },
    subtitle: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 16,
    },
    searchRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
    },
    searchButton: {
        backgroundColor: '#2563eb',
        borderRadius: 8,
        paddingHorizontal: 18,
        justifyContent: 'center',
    },
    searchButtonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    loader: {
        marginTop: 20,
    },
    errorText: {
        color: '#dc2626',
        textAlign: 'center',
        marginTop: 10,
    },
    emptyText: {
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    brandName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    genericName: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 10,
    },
    infoRow: {
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 12,
        color: '#2563eb',
        fontWeight: '600',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 13,
        color: '#334155',
        lineHeight: 18,
    },
});