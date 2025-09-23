import {useState} from 'react';
import {Link} from 'react-router';

import {demoUser} from '../App';
import type {User} from '../entities/user';
import {Page} from '../ui/page';

const NotFound = function () {
    const [user, setUser] = useState<User | null>(demoUser);

    const handleLogout = function () {
        setUser(null);
    };

    const handleLogin = function () {
        setUser(demoUser);
    };

    return (
        <Page user={user} handleLogin={handleLogin} handleLogout={handleLogout}>
            {user !== null ? (
                <div className="text-center py-5">
                    <h2 className="h4 mb-3 text-dark">Page not found</h2>
                    <p className="text-muted">We couldn't find the page you're looking for.</p>
                    <p className="mb-0">
                        <Link className="text-success fw-semibold" to="/">Back to dashboard</Link>
                    </p>
                </div>
            ) : (
                <div className="text-center py-5">
                    <h2 className="h4 mb-3 text-dark">You are signed out</h2>
                    <p className="text-muted">Sign back in to access administrative operations and tools.</p>
                    <button type="button" className="btn btn-success" onClick={handleLogin}>
                        Sign in again
                    </button>
                </div>
            )}
        </Page>
    );
};

export default NotFound;
