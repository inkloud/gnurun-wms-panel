import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter, Route, Routes} from 'react-router';

import App from './App.tsx';
import type {User} from './entities/user';
import './index.css';
import NotFound from './pages/NotFound.tsx';
import Picker from './pages/Picker.tsx';

const demoUser: User = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com'
};

const Root = function () {
    const [user, setUser] = React.useState<User | null>(demoUser);

    const handleLogout = function () {
        setUser(null);
    };

    const handleLogin = function () {
        setUser(demoUser);
    };

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<App user={user} handleLogin={handleLogin} handleLogout={handleLogout} />} />
                <Route
                    path="/picker"
                    element={<Picker user={user} handleLogin={handleLogin} handleLogout={handleLogout} />}
                />
                <Route
                    path="*"
                    element={<NotFound user={user} handleLogin={handleLogin} handleLogout={handleLogout} />}
                />
            </Routes>
        </HashRouter>
    );
};

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
