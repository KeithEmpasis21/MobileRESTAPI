import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMedicine, deleteMedicine } from '../api/api';

export default function MedicineDetailScreen({ route, navigation }) {
    const { medicineId } = route.params;
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            setLoading(true);

            getMedicine(medicineId)
                .then((response) => {
                    if (isActive && response.data.success) {
                        setMedicine(response.data.data);
                    } else if (isActive) {
                        setErrorMessage('Medicine not found.');
                    }
                })
                .catch(() => {
                    if (isActive) {
                        setErrorMessage('Failed to load medicine details.');
                    }
                })
                .finally(() => {
                    if (isActive) setLoading(false);
                });

            return () => {
                isActive = false;
            };
        }, [medicineId])
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (errorMessage || !medicine) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{errorMessage || 'No data available.'}</Text>
            </View>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            'Delete Medicine',
            `Are you sure you want to delete "${medicine.name}"? This cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            const response = await deleteMedicine(medicineId);
                            if (response.data.success) {
                                navigation.navigate('MedicineList');
                            } else {
                                Alert.alert('Error', 'Failed to delete medicine.');
                                setDeleting(false);
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Could not connect to the server.');
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.name}>{medicine.name}</Text>
            <Text style={styles.genericName}>{medicine.generic_name}</Text>

            <View style={styles.card}>
                <DetailRow label="Category" value={medicine.category} />
                <DetailRow label="Dosage Form" value={medicine.dosage_form} />
                <DetailRow label="Strength" value={medicine.strength} />
                <DetailRow label="Manufacturer" value={medicine.manufacturer} />
                <DetailRow label="Price" value={`PHP ${medicine.price}`} />
                <DetailRow label="Stock Quantity" value={String(medicine.stock_quantity)} />
                <DetailRow label="Expiry Date" value={medicine.expiry_date} />
            </View>

            <View style={styles.card}>
                <Text style={styles.descriptionLabel}>Description</Text>
                <Text style={styles.descriptionText}>{medicine.description}</Text>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('EditMedicine', { medicineId: medicine.id })}
                    disabled={deleting}
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function DetailRow({ label, value }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value || 'Not specified'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
    },
    genericName: {
        fontSize: 15,
        color: '#64748b',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    rowLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    rowValue: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '500',
    },
    descriptionLabel: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 6,
    },
    descriptionText: {
        fontSize: 15,
        color: '#1e293b',
        lineHeight: 22,
    },
    errorText: {
        color: '#dc2626',
        fontSize: 15,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#2563eb',
    },
    editButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#dc2626',
    },
    deleteButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});