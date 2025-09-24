import type {User} from '../entities/user';
import {LoginPanel} from '../ui/login_panel';
import {Page} from '../ui/page';

const Picker: React.FC<{user: User | null; handleLogin: () => void; handleLogout: () => void}> = function ({
    user,
    handleLogin,
    handleLogout
}) {
    return (
        <Page user={user} handleLogin={handleLogin} handleLogout={handleLogout}>
            {user !== null ? (
                <>
                    <header className="mb-4">
                        <h1 className="h2 mb-1 text-dark">Picker</h1>
                        <p className="text-muted mb-0">Select and coordinate resources for upcoming deployments.</p>
                    </header>

                    <div className="text-muted text-center py-5">Picker workspace coming soon.</div>
                </>
            ) : (
                <LoginPanel handleLogin={handleLogin} />
            )}
        </Page>
    );
};

export default Picker;
