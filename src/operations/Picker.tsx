import {useState} from 'react';

import {demoUser} from '../App';
import type {User} from '../entities/user';
import {Page} from '../ui/page';

const Picker = function () {
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
                <>
                    <header className="mb-4">
                        <h1 className="h2 mb-1 text-dark">Picker</h1>
                        <p className="text-muted mb-0">Select and coordinate resources for upcoming deployments.</p>
                    </header>
                </>
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

export default Picker;
