import React from 'react';

import {useAuth} from '../../hooks/auth';
import {Header} from '../../ui/header';
import {Page} from '../../ui/page';
import {MainPanel} from './main';

const StockProductsPage: React.FC = function () {
    const {data: authData} = useAuth();
    if (authData === undefined) return null;
    return (
        <Page>
            <Header title="Stock Products" subtitle="Search, locate, and manage warehouse product stock." />
            <MainPanel />
        </Page>
    );
};

export default StockProductsPage;
