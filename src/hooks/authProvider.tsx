import React from 'react';

import type {ReactNode} from 'react';
import type {User} from '../entities/user';
import {AuthContext, type Credentials} from './authContext';

const meUser: User = {name: 'Luca Bacchi', email: 'bacchilu@gmail.com'};
const meCredentials: Credentials = {username: 'bacchilu@gmail.com', password: 'bacchilu'};

export const AuthProvider: React.FC<{children: ReactNode}> = function ({children}) {
    const [user, setUser] = React.useState<User | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const handleLogin = function ({username, password}: Credentials) {
        if (username === meCredentials.username && password === meCredentials.password) {
            setUser(meUser);
            setErrorMessage(null);
            return;
        }

        setUser(null);
        setErrorMessage('Authentication Error!');
    };

    const handleLogout = function () {
        setUser(null);
        setErrorMessage(null);
    };

    return (
        <AuthContext.Provider value={{user, errorMessage, handleLogin, handleLogout}}>{children}</AuthContext.Provider>
    );
};
