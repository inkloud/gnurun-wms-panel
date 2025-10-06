import './app.css';
import type {Operation} from './entities/operation';
import {useAuth} from './hooks';
import {OperationCard} from './ui/operationCard';
import {Page} from './ui/page';

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
    const {user} = useAuth();

    return (
        <Page>
            {user !== null && user !== undefined && (
                <>
                    <header className="mb-4">
                        <h1 className="h2 mb-1 text-dark">Welcome back, {user.user.name.split(' ')[0]}!</h1>
                        <p className="text-muted mb-0">Choose an operation below to manage your workspace.</p>
                    </header>

                    <div className="row g-4">
                        {operations.map((operation) => (
                            <OperationCard key={operation.id} operation={operation} />
                        ))}
                    </div>
                </>
            )}
        </Page>
    );
};

export default App;
