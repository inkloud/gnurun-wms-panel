import {useState} from 'react';

import './App.css';
import type {Operation} from './entities/operation';
import type {User} from './entities/user';
import {OperationCard} from './ui/operation_card';
import {Page} from './ui/page';

const demoUser: User = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com'
};

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

const App = function () {
    const [user, setUser] = useState<User | null>(demoUser);

    const handleLogout = function () {
        setUser(null);
    };

    const handleLogin = function () {
        setUser(demoUser);
    };

    return (
        <Page user={user} handleLogin={handleLogin} handleLogout={handleLogout}>
            {user !== null ? (
                <>
                    <header className="mb-4">
                        <h1 className="h2 mb-1 text-dark">Welcome back, {user.name.split(' ')[0]}!</h1>
                        <p className="text-muted mb-0">Choose an operation below to manage your workspace.</p>
                    </header>

                    <div className="row g-4">
                        {operations.map((operation) => (
                            <OperationCard key={operation.id} operation={operation} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-5">
                    <h2 className="h4 mb-3 text-dark">You are signed out</h2>
                    <p className="text-muted">Sign back in to access administrative operations and tools.</p>
                    <button type="button" className="btn btn-success" onClick={handleLogin}>
                        Sign in again
                    </button>
                </div>
            )}
        </Page>
    );
};

export default App;
