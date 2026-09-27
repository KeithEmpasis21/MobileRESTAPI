import axios from 'axios';

const OPENFDA_BASE_URL = 'https://api.fda.gov/drug/label.json';

export const searchDrugInfo = (drugName) => {
    // Searches by brand name; openFDA needs the term wrapped in quotes for exact phrase matching
    const query = `openfda.brand_name:"${drugName}"`;
    return axios.get(OPENFDA_BASE_URL, {
        params: {
            search: query,
            limit: 5,
        },
    });
};