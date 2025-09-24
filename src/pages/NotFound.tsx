import {Link} from 'react-router';

import type {User} from '../entities/user';
import {LoginPanel} from '../ui/login_panel';
import {Page} from '../ui/page';

const NotFound: React.FC<{user: User | null; handleLogin: () => void; handleLogout: () => void}> = function ({
    user,
    handleLogin,
    handleLogout
}) {
    return (
        <Page user={user} handleLogin={handleLogin} handleLogout={handleLogout}>
            {user !== null ? (
                <div className="text-center py-5">
                    <h2 className="h4 mb-3 text-dark">Page not found</h2>
                    <p className="text-muted">We couldn't find the page you're looking for.</p>
                    <p className="mb-0">
                        <Link className="text-success fw-semibold" to="/">
                            Back to dashboard
                        </Link>
                    </p>
                </div>
            ) : (
                <LoginPanel handleLogin={handleLogin} />
            )}
        </Page>
    );
};

export default NotFound;
