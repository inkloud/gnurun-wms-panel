import axios, {AxiosError} from 'axios';
import useSWR from 'swr';

export type OperatorCandidate = {
    name: string;
    username: string;
};

type UsersApiRow = {
    username: string;
    name: string;
    type: string;
    warehouse: {
        id: number;
        name: string;
    };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const USERS_ENDPOINT = `${API_BASE_URL}/users`;

export const useWHOperators = function (token: string): {
    data: OperatorCandidate[] | undefined;
    error: AxiosError | undefined;
} {
    const fetcher = async (url: string): Promise<UsersApiRow[]> => {
        const response = await axios.get<UsersApiRow[]>(url, {
            headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
        });
        return response.data;
    };
    const {data, error} = useSWR<UsersApiRow[], AxiosError>(USERS_ENDPOINT, fetcher, {dedupingInterval: 60000});

    if (data === undefined) return {data, error};
    return {data: data.map((user) => ({name: user.name, username: user.username})), error};
};
