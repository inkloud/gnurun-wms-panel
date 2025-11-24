import axios from 'axios';
import React from 'react';

import type {AuthResponse} from '../../hooks/auth';
import {useAuth} from '../../hooks/auth';
import type {OperatorCandidate} from '../../hooks/wh-operators';
import {useWHOperators} from '../../hooks/wh-operators';
import {Header} from '../../ui/header';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const authenticateAsOperator = async (username: string, token: string) => {
    const response = await axios.get<AuthResponse>(`${API_BASE_URL}/auth/as/${encodeURIComponent(username)}`, {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
    });
    return response.data;
};

const OperatorButton: React.FC<{
    operator: OperatorCandidate;
    token: string;
    onImpersonate: (authData: AuthResponse) => void;
}> = function ({operator, token, onImpersonate}) {
    const handleClick = async function () {
        try {
            const impersonated = await authenticateAsOperator(operator.username, token);
            onImpersonate(impersonated);
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

export const MainManager: React.FC<{authData: AuthResponse}> = function ({authData}) {
    const {setToken} = useAuth();
    const {data: operatorCandidates, error} = useWHOperators(authData.access_token);

    return (
        <>
            <Header
                title={`Welcome back, ${authData.auth_user.name.split(' ')[0]}!`}
                subtitle="Choose an operator below to authenticate with and step into their workspace."
            />
            <p className="text-secondary fw-medium mb-2">{authData.auth_user.warehouse}</p>

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
                        <OperatorButton
                            key={operator.username}
                            operator={operator}
                            token={authData.access_token}
                            onImpersonate={setToken}
                        />
                    ))}
                </div>
            )}
        </>
    );
};
