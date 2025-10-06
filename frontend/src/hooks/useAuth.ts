import axios from 'axios';
import React from 'react';
import useSWR from 'swr';

interface Credentials {
    username: string;
    password: string;
}

interface AuthResponse {
    access_token: string;
    user: {username: string; name: string};
}

const InMemoryAuthStore = (function () {
    let current: AuthResponse | null = null;

    return {
        get: (): AuthResponse | null => current,
        set: (value: AuthResponse | null) => {
            current = value;
        }
    };
})();

const LocalStorageAuthStore = (function () {
    const AUTH_STORAGE_KEY = 'gnurun-wms-auth';

    return {
        get: (): AuthResponse | null => {
            const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);
            if (rawValue === null) return null;
            try {
                return JSON.parse(rawValue) as AuthResponse;
            } catch {
                localStorage.removeItem(AUTH_STORAGE_KEY);
                return null;
            }
        },
        set: (value: AuthResponse | null) => {
            if (value === null) {
                localStorage.removeItem(AUTH_STORAGE_KEY);
                return;
            }
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
        }
    };
})();

const FakeAuthProvider = {
    authenticate: async function (credentials: Credentials): Promise<AuthResponse | null> {
        const meUser = {name: 'Luca Bacchi', username: 'bacchilu@gmail.com'};
        const meCredentials: Credentials = {username: 'bacchilu@gmail.com', password: 'bacchilu'};

        if (credentials.username === meCredentials.username && credentials.password === meCredentials.password)
            return {access_token: 'AAABBBCCC', user: meUser} as AuthResponse;
        return null;
    },
    verifyToken: async function (accessToken: string): Promise<AuthResponse | null> {
        const meUser = {name: 'Luca Bacchi', username: 'bacchilu@gmail.com'};
        if (accessToken === 'AAABBBCCC') return {access_token: 'AAABBBCCC', user: meUser};
        return null;
    }
};

const RemoteAuthProvider = {
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

const CurrentStorage = LocalStorageAuthStore;
const Authenticator = RemoteAuthProvider;

export const useAuth = function () {
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const fetcher = async function (): Promise<AuthResponse | null> {
        const authData = CurrentStorage.get();
        if (authData === null) return null;
        return Authenticator.verifyToken(authData.access_token);
    };
    const {data, mutate} = useSWR<AuthResponse | null>('AUTH_SWR_KEY', fetcher, {dedupingInterval: 60000});

    const handleLogin = async function ({username, password}: Credentials) {
        const authData = await Authenticator.authenticate({username, password});
        if (authData !== null) {
            mutate(authData, {revalidate: false});
            CurrentStorage.set(authData);
            setErrorMessage(null);
            return;
        }

        mutate(null, {revalidate: false});
        CurrentStorage.set(null);
        setErrorMessage('Authentication Error!');
    };

    const handleLogout = function () {
        mutate(null, {revalidate: false});
        CurrentStorage.set(null);
        setErrorMessage(null);
    };

    return {user: data, errorMessage, handleLogin, handleLogout};
};
