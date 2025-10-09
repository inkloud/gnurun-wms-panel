import React from 'react';
import useSWR from 'swr';

import {RemoteAuthProvider} from './providers';
import {LocalStorageAuthStore} from './stores';
import type {AuthProvider, AuthResponse, AuthStore, Credentials} from './types';

const CurrentStorage: AuthStore = LocalStorageAuthStore;
const Authenticator: AuthProvider = RemoteAuthProvider;

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

    return {data, errorMessage, handleLogin, handleLogout};
};
