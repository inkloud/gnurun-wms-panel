export interface Credentials {
    username: string;
    password: string;
}

type UserType = 'MANAGER' | 'OPERATOR';

export interface AuthResponse {
    access_token: string;
    auth_user: {username: string; name: string; warehouse: string; type: UserType};
}

export interface AuthStore {
    get: () => AuthResponse | null;
    set: (value: AuthResponse | null) => void;
}

export interface AuthProvider {
    authenticate: (credentials: Credentials) => Promise<AuthResponse | null>;
    verifyToken: (accessToken: string) => Promise<AuthResponse | null>;
}
