import React from 'react';

import type {User} from '../entities/user';

const demoUser: User = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com'
};

export const useAuth = function () {
    const [user, setUser] = React.useState<User | null>(demoUser);

    const handleLogin = function () {
        setUser(demoUser);
    };

    const handleLogout = function () {
        setUser(null);
    };

    return {user, handleLogin, handleLogout};
};
