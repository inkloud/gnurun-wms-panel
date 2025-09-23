import 'bootstrap/dist/css/bootstrap.min.css';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter, Route, Routes} from 'react-router';

import App from './App.tsx';
import NotFound from './operations/NotFound.tsx';
import Picker from './operations/Picker.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/picker" element={<Picker />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </HashRouter>
    </StrictMode>
);
