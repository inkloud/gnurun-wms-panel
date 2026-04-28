import React from 'react';
import {Link, useNavigate} from 'react-router';

import {useAuth} from '../hooks/auth';
import {LoginPanel} from './login-panel';

const Navbar = function () {
    const navigate = useNavigate();
    const {data: user, handleLogout} = useAuth();

    const doHandleLogout = function () {
        navigate('/');
        handleLogout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
            <div className="container py-2">
                <Link className="navbar-brand fw-semibold" to="/">
                    GnuRun WMS Panel
                </Link>
                {user !== null && user !== undefined && (
                    <>
                        <span className="navbar-text text-white-50 ms-3">{user.auth_user.warehouse.name}</span>
                        <div className="ms-auto d-flex align-items-center gap-3">
                            <div className="text-white small text-end">
                                <div className="d-flex align-items-center justify-content-end gap-2">
                                    <span className="fw-semibold">{user.auth_user.name}</span>
                                    <span className="badge text-bg-light text-uppercase">{user.auth_user.type}</span>
                                </div>
                                <div className="opacity-75">{user.auth_user.username}</div>
                            </div>
                            <button type="button" className="btn btn-outline-light btn-sm" onClick={doHandleLogout}>
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

const LoadingPage = function () {
    return (
        <div className="app-shell d-flex flex-column min-vh-100">
            <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="text-center text-muted fw-semibold">Checking Authentication...</div>
            </main>
        </div>
    );
};

export const Page: React.FC<{children: React.ReactNode}> = function ({children}) {
    const {data: user} = useAuth();

    if (user === undefined) return <LoadingPage />;
    return (
        <div className="app-shell d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 py-5">
                <div className="container">{user !== null ? children : <LoginPanel />}</div>
            </main>
        </div>
    );
};
