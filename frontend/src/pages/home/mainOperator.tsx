import React from 'react';

import type {Operation} from '../../entities/operation';
import type {AuthResponse} from '../../hooks/auth';
import {Header} from '../../ui/header';
import {OperationCard} from '../../ui/operationCard';

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

export const MainOperator: React.FC<{authData: AuthResponse}> = function ({authData}) {
    return (
        <>
            <Header
                title={`Welcome back, ${authData.auth_user.name.split(' ')[0]}!`}
                subtitle="Choose an operation below to manage your workspace."
            />
            <p className="text-secondary fw-medium mb-2">{authData.auth_user.warehouse}</p>

            <div className="row g-4">
                {operations.map((operation) => (
                    <OperationCard key={operation.id} operation={operation} />
                ))}
            </div>
        </>
    );
};
