export const LoginPanel: React.FC<{handleLogin: () => void}> = function ({handleLogin}) {
    return (
        <div className="text-center py-5">
            <h2 className="h4 mb-3 text-dark">You are signed out</h2>
            <p className="text-muted">Sign back in to access administrative operations and tools.</p>
            <button type="button" className="btn btn-success" onClick={handleLogin}>
                Sign in again
            </button>
        </div>
    );
};
