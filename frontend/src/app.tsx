import axios from 'axios';

import './app.css';
import type {Operation} from './entities/operation';
import {useAuth, useWHOperators} from './hooks';
import {UserType, type AuthResponse} from './hooks/auth/types';
import type {OperatorCandidate} from './hooks/useWHOperators';
import {OperationCard} from './ui/operationCard';
import {Page} from './ui/page';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const operations: Operation[] = [
    {
        name: 'Picker',
        description: 'Select and coordinate resources for upcoming deployments.',
        id: 'picker'
    },
    {
        name: 'Dummy Template',
        description: 'Spin up a sandbox template to prototype new workflows quickly.',
        id: 'dummy-template'
    },
    {
        name: 'Reports',
        description: 'Review usage trends and export insights for stakeholders.',
        id: 'reports'
    }
];

const authenticateAsOperator = async (username: string, token: string) => {
    const response = await axios.get<AuthResponse>(`${API_BASE_URL}/auth/as/${encodeURIComponent(username)}`, {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
    });
    return response.data;
};

const MainOperator: React.FC<{authData: AuthResponse}> = function ({authData}) {
    return (
        <>
            <header className="mb-4">
                <h1 className="h2 mb-1 text-dark">Welcome back, {authData.auth_user.name.split(' ')[0]}!</h1>
                <p className="text-secondary fw-medium mb-2">{authData.auth_user.warehouse}</p>
                <p className="text-muted mb-0">Choose an operation below to manage your workspace.</p>
            </header>

            <div className="row g-4">
                {operations.map((operation) => (
                    <OperationCard key={operation.id} operation={operation} />
                ))}
            </div>
        </>
    );
};

const OperatorButton: React.FC<{operator: OperatorCandidate; token: string}> = function ({operator, token}) {
    const handleClick = async function () {
        try {
            const impersonated = await authenticateAsOperator(operator.username, token);
            console.log('Authenticated as', impersonated.auth_user.username);
        } catch (error) {
            console.error('Failed to authenticate as operator', error);
        }
    };

    return (
        <div className="col-12 col-md-6 col-xl-4">
            <button
                type="button"
                className="btn btn-outline-primary w-100 text-start d-flex flex-column align-items-start"
                onClick={handleClick}
            >
                <span className="fw-semibold">{operator.name}</span>
                <span className="text-secondary small">{operator.username}</span>
            </button>
        </div>
    );
};

const MainManager: React.FC<{authData: AuthResponse}> = function ({authData}) {
    const {data: operatorCandidates, error} = useWHOperators(authData.access_token);

    return (
        <>
            <header className="mb-4">
                <h1 className="h2 mb-1 text-dark">Welcome back, {authData.auth_user.name.split(' ')[0]}!</h1>
                <p className="text-secondary fw-medium mb-2">{authData.auth_user.warehouse}</p>
                <p className="text-muted mb-0">
                    Choose an operator below to authenticate with and step into their workspace.
                </p>
            </header>

            {error !== undefined && (
                <div className="alert alert-danger" role="alert">
                    Unable to load operators. Please retry.
                </div>
            )}

            {operatorCandidates === undefined ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading operators...</span>
                    </div>
                </div>
            ) : (
                <div className="row g-3">
                    {operatorCandidates.map((operator) => (
                        <OperatorButton key={operator.username} operator={operator} token={authData.access_token} />
                    ))}
                </div>
            )}
        </>
    );
};

const Main: React.FC<{authData: AuthResponse}> = function ({authData}) {
    if (authData.auth_user.type === UserType.OPERATOR) return <MainOperator authData={authData} />;
    if (authData.auth_user.type === UserType.MANAGER) return <MainManager authData={authData} />;
};

const App = function () {
    const {data} = useAuth();

    return (
        <Page>
            <Main authData={data!} />
        </Page>
    );
};

export default App;
