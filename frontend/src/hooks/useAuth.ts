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

interface AuthenticateFunction {
    (credentials: Credentials): Promise<AuthResponse | null>;
}

let CURRENT: AuthResponse | null = null;

const mockedAuthentication: AuthenticateFunction = async function (credentials: Credentials) {
    const meUser = {name: 'Luca Bacchi', username: 'bacchilu@gmail.com'};
    const meCredentials: Credentials = {username: 'bacchilu@gmail.com', password: 'bacchilu'};

    if (credentials.username === meCredentials.username && credentials.password === meCredentials.password)
        return {access_token: 'AAABBBCCC', user: meUser} as AuthResponse;
    return null;
};

const backendAuthentication: AuthenticateFunction = async function (credentials: Credentials) {
    try {
        const response = await axios.post<AuthResponse>('http://0.0.0.0:8000/auth', credentials);
        return response.data;
    } catch {
        return null;
    }
};

const authenticate: AuthenticateFunction = backendAuthentication;

export const useAuth = function () {
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const fetcher = async function () {
        return CURRENT;
    };
    const {data, mutate} = useSWR<AuthResponse | null>('AUTH_SWR_KEY', fetcher);

    const handleLogin = async function ({username, password}: Credentials) {
        const authData = await authenticate({username, password});
        if (authData !== null) {
            mutate(authData, {revalidate: false});
            CURRENT = authData;
            setErrorMessage(null);
            return;
        }

        mutate(null, {revalidate: false});
        CURRENT = null;
        setErrorMessage('Authentication Error!');
    };

    const handleLogout = function () {
        mutate(null, {revalidate: false});
        CURRENT = null;
        setErrorMessage(null);
    };

    return {user: data, errorMessage, handleLogin, handleLogout};
};
