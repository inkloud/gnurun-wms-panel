import React from 'react';
import useSWR from 'swr';

import type {User} from '../entities/user';

interface Credentials {
    username: string;
    password: string;
}

const meUser: User = {name: 'Luca Bacchi', email: 'bacchilu@gmail.com'};
const meCredentials: Credentials = {username: 'bacchilu@gmail.com', password: 'bacchilu'};

let CURRENT: User | null = null;

export const useAuth = function () {
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const fetcher = async function () {
        return CURRENT;
    };
    const {data, mutate} = useSWR<User | null>('AUTH_SWR_KEY', fetcher);

    const handleLogin = function ({username, password}: Credentials) {
        if (username === meCredentials.username && password === meCredentials.password) {
            mutate(meUser, {revalidate: false});
            CURRENT = meUser;
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
