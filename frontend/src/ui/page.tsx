import React from 'react';
import {Link} from 'react-router';

import {useAuth} from '../hooks';
import {LoginPanel} from './loginPanel';

const Navbar = function () {
    const {data: user, handleLogout} = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
            <div className="container py-2">
                <Link className="navbar-brand fw-semibold" to="/">
                    GnuRun WMS Panel
                </Link>
                {user !== null && user !== undefined && (
                    <>
                        <span className="navbar-text text-white-50 ms-3">{user.auth_user.warehouse}</span>
                        <div className="ms-auto d-flex align-items-center gap-3">
                            <div className="text-white small text-end">
                                <div className="fw-semibold">{user.auth_user.name}</div>
                                <div className="opacity-75">{user.auth_user.username}</div>
                            </div>
                            <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export const Page: React.FC<{children: React.ReactNode}> = function ({children}) {
    const {data: user} = useAuth();

    if (user === undefined) return null;

    return (
        <div className="app-shell d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 py-5">
                <div className="container">{user !== null ? children : <LoginPanel />}</div>
            </main>
        </div>
    );
};
