import React from 'react';

import type {AuthResponse} from '../../hooks/auth';
import {useOperations} from '../../hooks/operations';
import {Header} from '../../ui/header';
import {OperationCard} from '../../ui/operation-card';

export const MainOperator: React.FC<{authData: AuthResponse}> = function ({authData}) {
    const operations = useOperations();

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
