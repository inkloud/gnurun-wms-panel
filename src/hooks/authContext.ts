import React from 'react';

import type {User} from '../entities/user';

export interface Credentials {
    username: string;
    password: string;
}

export interface AuthContextValue {
    user: User | null;
    errorMessage: string | null;
    handleLogin: (credentials: Credentials) => void;
    handleLogout: () => void;
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);
