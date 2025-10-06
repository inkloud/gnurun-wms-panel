export interface Credentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user: {username: string; name: string};
}

export interface AuthStore {
    get: () => AuthResponse | null;
    set: (value: AuthResponse | null) => void;
}

export interface AuthProvider {
    authenticate: (credentials: Credentials) => Promise<AuthResponse | null>;
    verifyToken: (accessToken: string) => Promise<AuthResponse | null>;
}
