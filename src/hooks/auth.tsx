import React from 'react';

import type {User} from '../entities/user';

const meUser: User = {name: 'Luca Bacchi', email: 'bacchilu@gmail.com'};
const meCredentials: Credentials = {username: 'bacchilu@gmail.com', password: 'bacchilu'};

export interface Credentials {
    username: string;
    password: string;
}

interface AuthContextValue {
    user: User | null;
    errorMessage: string | null;
    handleLogin: (credentials: Credentials) => void;
    handleLogout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = function ({children}) {
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

export const useAuth = function () {
    const context = React.useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
