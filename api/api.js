import axios from 'axios';

const BASE_URL = 'http://medicinesapp.duckdns.org/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getMedicines = (searchQuery = '') => {
    const params = searchQuery ? { search: searchQuery } : {};
    return api.get('/get_medicines.php', { params });
};

export const getMedicine = (id) => {
    return api.get('/get_medicine.php', { params: { id } });
};

export const addMedicine = (medicineData) => {
    return api.post('/add_medicine.php', medicineData);
};

export const updateMedicine = (medicineData) => {
    return api.post('/update_medicine.php', medicineData);
};

export const deleteMedicine = (id) => {
    return api.post('/delete_medicine.php', { id });
};

export default api;