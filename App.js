import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MedicineListScreen from './screens/MedicineListScreen';
import MedicineDetailScreen from './screens/MedicineDetailScreen';
import AddMedicineScreen from './screens/AddMedicineScreen';
import EditMedicineScreen from './screens/EditMedicineScreen';
import DrugLookupScreen from './screens/DrugLookupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="MedicineList">
                <Stack.Screen
                    name="MedicineList"
                    component={MedicineListScreen}
                    options={({ navigation }) => ({
                        title: 'Medicines Directory',
                        headerRight: () => (
                            <View style={{ flexDirection: 'row', gap: 4 }}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('DrugLookup')}
                                    style={{ paddingHorizontal: 8 }}
                                >
                                    <Text style={{ color: '#2563eb', fontSize: 15, fontWeight: '600' }}>
                                        Drug Info
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('AddMedicine')}
                                    style={{ paddingHorizontal: 8 }}
                                >
                                    <Text style={{ color: '#2563eb', fontSize: 16, fontWeight: '600' }}>
                                        + Add
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ),
                    })}
                />
                <Stack.Screen
                    name="MedicineDetail"
                    component={MedicineDetailScreen}
                    options={{ title: 'Medicine Details' }}
                />
                <Stack.Screen
                    name="AddMedicine"
                    component={AddMedicineScreen}
                    options={{ title: 'Add Medicine' }}
                />
                <Stack.Screen
                    name="EditMedicine"
                    component={EditMedicineScreen}
                    options={{ title: 'Edit Medicine' }}
                />
                <Stack.Screen
                    name="DrugLookup"
                    component={DrugLookupScreen}
                    options={{ title: 'Drug Info Lookup' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}