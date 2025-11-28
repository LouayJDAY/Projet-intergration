// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const config = {
    apiUrl: API_URL,
    clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
};

export default config;
