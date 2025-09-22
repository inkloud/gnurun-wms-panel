import {Link} from 'react-router';
import type {User} from '../entities/user';

const Navbar: React.FC<{user: User | null; handleLogout: () => void; handleLogin: () => void}> = function ({
    user,
    handleLogout,
    handleLogin
}) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
            <div className="container py-2">
                <Link className="navbar-brand fw-semibold" to="/">
                    Warehouse Panel
                </Link>
                <div className="ms-auto d-flex align-items-center gap-3">
                    {user !== null ? (
                        <>
                            <div className="text-white small text-end">
                                <div className="fw-semibold">{user.name}</div>
                                <div className="opacity-75">{user.email}</div>
                            </div>
                            <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogin}>
                            Sign in
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export const Page: React.FC<{
    user: User | null;
    handleLogin: () => void;
    handleLogout: () => void;
    children: React.ReactNode;
}> = function ({user, handleLogin, handleLogout, children}) {
    return (
        <div className="app-shell d-flex flex-column min-vh-100">
            <Navbar user={user} handleLogout={handleLogout} handleLogin={handleLogin} />

            <main className="flex-grow-1 py-5">
                <div className="container">{children}</div>
            </main>
        </div>
    );
};
