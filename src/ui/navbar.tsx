import type {User} from '../entities/user';

export const Navbar: React.FC<{user: User | null; handleLogout: () => void; handleLogin: () => void}> = function ({
    user,
    handleLogout,
    handleLogin
}) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
            <div className="container py-2">
                <span className="navbar-brand fw-semibold">Warehouse Panel</span>
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
