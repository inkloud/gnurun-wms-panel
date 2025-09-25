import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter, Route, Routes} from 'react-router';

import App from './App.tsx';
import './index.css';
import NotFound from './pages/NotFound.tsx';
import Picker from './pages/Picker.tsx';
import {AuthProvider} from './hooks/auth';

const Root = function () {
    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/picker" element={<Picker />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
};

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
