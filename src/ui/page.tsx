import {Link} from 'react-router';
import type {User} from '../entities/user';
import {useAuth} from '../hooks/auth';
import {LoginPanel} from './login_panel';

const Navbar: React.FC<{user: User | null; handleLogout: () => void}> = function ({user, handleLogout}) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
            <div className="container py-2">
                <Link className="navbar-brand fw-semibold" to="/">
                    GnuRun WMS Panel
                </Link>
                <div className="ms-auto d-flex align-items-center gap-3">
                    {user !== null && (
                        <>
                            <div className="text-white small text-end">
                                <div className="fw-semibold">{user.name}</div>
                                <div className="opacity-75">{user.email}</div>
                            </div>
                            <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export const Page: React.FC<{children: React.ReactNode}> = function ({children}) {
    const {user, handleLogin, handleLogout} = useAuth();

    return (
        <div className="app-shell d-flex flex-column min-vh-100">
            <Navbar user={user} handleLogout={handleLogout} />

            <main className="flex-grow-1 py-5">
                <div className="container">{user !== null ? children : <LoginPanel handleLogin={handleLogin} />}</div>
            </main>
        </div>
    );
};
