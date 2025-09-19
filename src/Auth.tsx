import {useState} from 'react';

import type {FormEvent} from 'react';
import './App.css';

const Auth = function () {
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = function (event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');

        if (typeof email === 'string' && email.trim().length > 0) {
            setStatus(`Signed in as ${email}`);
        } else {
            setStatus(null);
        }

        event.currentTarget.reset();
    };

    return (
        <main className="bg-light">
            <div className="container min-vh-100 py-5 d-flex align-items-center">
                <div className="row justify-content-center w-100">
                    <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4 p-md-5">
                                <h1 className="h3 mb-3 text-center">Sign in</h1>
                                {status && (
                                    <div className="alert alert-success" role="status">
                                        {status}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="name@example.com"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label htmlFor="password" className="form-label mb-0">
                                                Password
                                            </label>
                                            <a href="#" className="small text-decoration-none">
                                                Forgot password?
                                            </a>
                                        </div>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="remember"
                                                name="remember"
                                            />
                                            <label className="form-check-label" htmlFor="remember">
                                                Remember me
                                            </label>
                                        </div>
                                        <a href="#" className="small text-decoration-none">
                                            Create account
                                        </a>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">
                                        Sign in
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Auth;
