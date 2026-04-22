import axios from 'axios';

import {UserType, type AuthProvider, type AuthResponse, type Credentials} from './types';

type RemoteAuthResponse = {
    access_token: string;
    auth_user: {
        username: string;
        name: string;
        warehouse: string;
        type: 'MANAGER' | 'OPERATOR';
    };
};

export const FakeAuthProvider: AuthProvider = (function () {
    const resToken: AuthResponse = {
        access_token: 'AAABBBCCC',
        auth_user: {
            name: 'Warehouse Manager',
            username: 'manager@gnu000.com',
            warehouse: 'Life365 - Forli - Gnu000',
            type: UserType.MANAGER
        }
    };

    return {
        authenticate: async function (credentials: Credentials): Promise<AuthResponse | null> {
            if (credentials.username === 'manager@gnu000.com' && credentials.password === 'manager') return resToken;
            return null;
        },
        verifyToken: async function (accessToken: string): Promise<AuthResponse | null> {
            if (accessToken === 'AAABBBCCC') return resToken;
            return null;
        }
    };
})();

export const RemoteAuthProvider: AuthProvider = (function () {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/wms/api';

    const fromRemoteAuthResponse = function (payload: RemoteAuthResponse): AuthResponse {
        return {
            access_token: payload.access_token,
            auth_user: {...payload.auth_user, type: UserType[payload.auth_user.type]}
        };
    };

    return {
        authenticate: async function (credentials: Credentials): Promise<AuthResponse | null> {
            try {
                const response = await axios.post<RemoteAuthResponse>(`${API_BASE_URL}/auth`, credentials);
                return fromRemoteAuthResponse(response.data);
            } catch {
                return null;
            }
        },
        verifyToken: async function (accessToken: string): Promise<AuthResponse | null> {
            try {
                const response = await axios.get<RemoteAuthResponse>(`${API_BASE_URL}/auth`, {
                    headers: {Authorization: `Bearer ${accessToken}`}
                });
                return fromRemoteAuthResponse(response.data);
            } catch {
                return null;
            }
        }
    };
})();
