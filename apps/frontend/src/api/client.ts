import axios from 'axios';

// 1. Create the base Axios instance
export const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Request Interceptor: The Outbound Checkpoint
// Before any request leaves the browser, this function runs.
apiClient.interceptors.request.use(
    (config) => {
        // Attempt to retrieve the access token from the browser's vault
        const token = localStorage.getItem('access_token');

        // If a token exists, automatically attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor: The Inbound Checkpoint
// Before any response reaches your React components, this function runs.
apiClient.interceptors.response.use(
    (response) => {
        // If the HTTP status is 2xx, let it pass through smoothly
        return response;
    },
    (error) => {
        // Check if the server rejected us because the token is missing, invalid, or expired (401)
        if (error.response && error.response.status === 401) {
            console.warn('Authentication failed or token expired. Forcing logout...');

            // Step A: Shred the invalid access card
            localStorage.removeItem('access_token');

            // Step B: Forcefully kick the user back to the login page
            // We use window.location.href here because this file is outside the React Router context
            window.location.href = '/login';
        }

        // Pass the error down to the component so it can display a red warning box if needed
        return Promise.reject(error);
    }
);