import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { addMedicine } from '../api/api';

export default function AddMedicineScreen({ navigation }) {
    const [name, setName] = useState('');
    const [genericName, setGenericName] = useState('');
    const [category, setCategory] = useState('');
    const [dosageForm, setDosageForm] = useState('');
    const [strength, setStrength] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [description, setDescription] = useState('');

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Medicine name is required.';
        }

        if (!price.trim()) {
            newErrors.price = 'Price is required.';
        } else if (isNaN(parseFloat(price))) {
            newErrors.price = 'Price must be a number.';
        }

        if (stockQuantity.trim() && isNaN(parseInt(stockQuantity, 10))) {
            newErrors.stockQuantity = 'Stock quantity must be a whole number.';
        }

        if (expiryDate.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(expiryDate.trim())) {
            newErrors.expiryDate = 'Use the format YYYY-MM-DD, e.g. 2027-06-30.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        setSubmitting(true);

        try {
            const response = await addMedicine({
                name: name.trim(),
                generic_name: genericName.trim(),
                category: category.trim(),
                dosage_form: dosageForm.trim(),
                strength: strength.trim(),
                manufacturer: manufacturer.trim(),
                price: parseFloat(price),
                stock_quantity: stockQuantity.trim() ? parseInt(stockQuantity, 10) : 0,
                expiry_date: expiryDate.trim() || null,
                description: description.trim(),
            });

            if (response.data.success) {
                Alert.alert('Success', 'Medicine added successfully.', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
                Alert.alert('Error', response.data.error || 'Failed to add medicine.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not connect to the server. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <FormField
                label="Medicine Name *"
                value={name}
                onChangeText={setName}
                error={errors.name}
                placeholder="e.g. Biogesic"
            />
            <FormField
                label="Generic Name"
                value={genericName}
                onChangeText={setGenericName}
                placeholder="e.g. Paracetamol"
            />
            <FormField
                label="Category"
                value={category}
                onChangeText={setCategory}
                placeholder="e.g. Analgesic"
            />
            <FormField
                label="Dosage Form"
                value={dosageForm}
                onChangeText={setDosageForm}
                placeholder="e.g. Tablet, Capsule, Syrup"
            />
            <FormField
                label="Strength"
                value={strength}
                onChangeText={setStrength}
                placeholder="e.g. 500mg"
            />
            <FormField
                label="Manufacturer"
                value={manufacturer}
                onChangeText={setManufacturer}
                placeholder="e.g. Unilab"
            />
            <FormField
                label="Price (PHP) *"
                value={price}
                onChangeText={setPrice}
                error={errors.price}
                placeholder="e.g. 5.50"
                keyboardType="decimal-pad"
            />
            <FormField
                label="Stock Quantity"
                value={stockQuantity}
                onChangeText={setStockQuantity}
                error={errors.stockQuantity}
                placeholder="e.g. 200"
                keyboardType="number-pad"
            />
            <FormField
                label="Expiry Date"
                value={expiryDate}
                onChangeText={setExpiryDate}
                error={errors.expiryDate}
                placeholder="YYYY-MM-DD"
            />
            <FormField
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="What is this medicine used for?"
                multiline
            />

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.submitButtonText}>Add Medicine</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

function FormField({ label, error, multiline, ...inputProps }) {
    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && styles.multilineInput, error && styles.inputError]}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                {...inputProps}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    fieldContainer: {
        marginBottom: 14,
    },
    label: {
        fontSize: 14,
        color: '#334155',
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
    },
    multilineInput: {
        minHeight: 90,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: '#dc2626',
    },
    errorText: {
        color: '#dc2626',
        fontSize: 12,
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: '#2563eb',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});