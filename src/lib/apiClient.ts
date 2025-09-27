// src/lib/apiClient.ts
import ky from 'ky';
import { auth } from './firebase';

// This will now be "/api-proxy"
console.log("API CLIENT INITIALIZED WITH URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

const apiClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  hooks: {
    // We still send the token to our proxy, which will forward it.
    beforeRequest: [
      async (request) => {
        try {
          const token = await auth.currentUser?.getIdToken();
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        } catch (error) {
          console.error("Firebase Auth: Could not retrieve ID token.", error);
        }
      },
    ],
  },
  timeout: 30000,
});

export default apiClient;