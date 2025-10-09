import axios from 'axios';

import type {AuthProvider, AuthResponse, Credentials} from './types';

export const FakeAuthProvider: AuthProvider = {
    authenticate: async function (credentials: Credentials): Promise<AuthResponse | null> {
        const meUser = {name: 'Luca Bacchi', username: 'bacchilu@gmail.com'};
        const meCredentials: Credentials = {username: 'bacchilu@gmail.com', password: 'bacchilu'};

        if (credentials.username === meCredentials.username && credentials.password === meCredentials.password)
            return {access_token: 'AAABBBCCC', auth_user: meUser} as AuthResponse;
        return null;
    },
    verifyToken: async function (accessToken: string): Promise<AuthResponse | null> {
        const meUser = {name: 'Luca Bacchi', username: 'bacchilu@gmail.com'};
        if (accessToken === 'AAABBBCCC') return {access_token: 'AAABBBCCC', auth_user: meUser};
        return null;
    }
};

export const RemoteAuthProvider: AuthProvider = {
    authenticate: async function (credentials: Credentials): Promise<AuthResponse | null> {
        try {
            const response = await axios.post<AuthResponse>('http://0.0.0.0:8000/auth', credentials);
            return response.data;
        } catch {
            return null;
        }
    },
    verifyToken: async function (accessToken: string): Promise<AuthResponse | null> {
        try {
            const {data} = await axios.get<AuthResponse>('http://0.0.0.0:8000/auth', {
                headers: {Authorization: `Bearer ${accessToken}`}
            });
            return data;
        } catch {
            return null;
        }
    }
};
