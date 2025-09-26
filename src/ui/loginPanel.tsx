import React from 'react';

import {useAuth} from '../hooks/useAuth';

export const LoginPanel = function () {
    const {handleLogin, errorMessage} = useAuth();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const isSubmitDisabled = username.trim() === '' || password.trim() === '';

    const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isSubmitDisabled) return;

        handleLogin({username, password});
    };

    return (
        <div className="d-flex justify-content-center py-5">
            <div className="w-100" style={{maxWidth: '420px'}}>
                <h2 className="h4 mb-2 text-dark text-center">Sign back in</h2>
                <p className="text-muted text-center mb-4">
                    Enter your credentials to access administrative operations and tools.
                </p>

                <form className="card shadow-sm border-0" onSubmit={handleSubmit} noValidate>
                    <div className="card-body p-4">
                        {errorMessage !== null && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="loginUsername">
                                Username
                            </label>
                            <input
                                id="loginUsername"
                                type="email"
                                className="form-control"
                                placeholder="name@example.com"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label" htmlFor="loginPassword">
                                Password
                            </label>
                            <input
                                id="loginPassword"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-success w-100" disabled={isSubmitDisabled}>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
