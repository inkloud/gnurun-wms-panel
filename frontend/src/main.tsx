import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter, Outlet, Route, Routes} from 'react-router';

import App from './app.tsx';
import './index.css';
import NotFound from './pages/not-found';
import Picker from './pages/picker';
import PickerWorker from './pages/picker-worker';

const PickerRoutes = function () {
    return <Outlet />;
};

const Root = function () {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/picker" element={<PickerRoutes />}>
                    <Route index element={<Picker />} />
                    <Route path="work" element={<PickerWorker />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </HashRouter>
    );
};

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
