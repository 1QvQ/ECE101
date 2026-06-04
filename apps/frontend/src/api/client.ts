import axios from 'axios';

// Create an instance of axios to be used for all API requests
export const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})