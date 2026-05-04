import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter, Outlet, Route, Routes} from 'react-router';

import App from './app.tsx';
import './index.css';
import NotFound from './pages/not-found';
import Picker from './pages/picker/home';
import PickerWorker from './pages/picker/work';
import StockProducts from './pages/stock-products';
import StockProductsPrint from './pages/stock-products/print';

const PickerRoutes = function () {
    return <Outlet />;
};

const StockProductsRoutes = function () {
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
                <Route path="/stock-products" element={<StockProductsRoutes />}>
                    <Route index element={<StockProducts />} />
                    <Route path="label" element={<StockProductsPrint />} />
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
