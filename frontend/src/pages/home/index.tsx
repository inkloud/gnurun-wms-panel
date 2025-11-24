import React from 'react';

import {useAuth, UserType, type AuthResponse} from '../../hooks/auth';
import {Page} from '../../ui/page';
import {MainManager} from './main-manager';
import {MainOperator} from './main-operator';

const Main: React.FC<{authData: AuthResponse}> = function ({authData}) {
    if (authData.auth_user.type === UserType.OPERATOR) return <MainOperator authData={authData} />;
    if (authData.auth_user.type === UserType.MANAGER) return <MainManager authData={authData} />;
    return null;
};

const App: React.FC = function () {
    const {data} = useAuth();

    return (
        <Page>
            <Main authData={data!} />
        </Page>
    );
};

export default App;
export {MainManager, MainOperator};
