import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter, Route, Routes} from 'react-router';

import App from './app.tsx';
import './index.css';
import NotFound from './pages/notFound.tsx';
import Picker from './pages/picker.tsx';
import {AuthProvider} from './hooks/authProvider.tsx';

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
