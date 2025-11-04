import React from 'react';

import {useAuth} from '../../hooks';
import {UserType, type AuthResponse} from '../../hooks/auth';
import {Page} from '../../ui/page';
import {MainManager} from './mainManager';
import {MainOperator} from './mainOperator';

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
