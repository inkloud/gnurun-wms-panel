import type {AuthResponse, AuthStore} from './types';

const AUTH_STORAGE_KEY = 'gnurun-wms-auth';

export const InMemoryAuthStore: AuthStore = (function () {
    let current: AuthResponse | null = null;

    return {
        get: (): AuthResponse | null => current,
        set: (value: AuthResponse | null) => {
            current = value;
        }
    };
})();

export const LocalStorageAuthStore: AuthStore = (function () {
    const hasWindow = () => typeof window !== 'undefined';

    return {
        get: (): AuthResponse | null => {
            if (!hasWindow()) return null;
            const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
            if (rawValue === null) return null;
            try {
                return JSON.parse(rawValue) as AuthResponse;
            } catch {
                window.localStorage.removeItem(AUTH_STORAGE_KEY);
                return null;
            }
        },
        set: (value: AuthResponse | null) => {
            if (!hasWindow()) return;
            if (value === null) {
                window.localStorage.removeItem(AUTH_STORAGE_KEY);
                return;
            }
            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
        }
    };
})();
