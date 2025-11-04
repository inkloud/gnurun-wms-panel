import axios, {AxiosError} from 'axios';
import useSWR from 'swr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const USERS_ENDPOINT = `${API_BASE_URL}/picker`;

export const usePicker = function (token: string): {data: string | undefined; error: AxiosError | undefined} {
    const fetcher = async (url: string): Promise<string> => {
        const response = await axios.get<string>(url, {
            headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
        });
        return response.data;
    };
    const {data, error} = useSWR<string, AxiosError>(USERS_ENDPOINT, fetcher, {dedupingInterval: 60000});

    return {data, error};
};
