import axios, {AxiosError} from 'axios';
import useSWR from 'swr';
import {z} from 'zod';

import type {OperatorUser} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const USERS_ENDPOINT = `${API_BASE_URL}/users`;

const UsersApiSchema = z.object({
    username: z.string(),
    name: z.string(),
    type: z.literal('OPERATOR'),
    warehouse: z.object({
        id: z.number(),
        name: z.string()
    })
});
type UsersApiSchemaInput = z.input<typeof UsersApiSchema>;
type UsersApiSchemaOutput = z.infer<typeof UsersApiSchema>;

const toOperatorUser = function (data: UsersApiSchemaInput): OperatorUser {
    const res: UsersApiSchemaOutput = UsersApiSchema.parse(data);
    return {name: res.name, username: res.username};
};

export const useWHOperators = function (token: string): {
    data: OperatorUser[] | undefined;
    error: AxiosError | undefined;
} {
    const fetcher = async (url: string): Promise<OperatorUser[]> => {
        const response = await axios.get<UsersApiSchemaInput[]>(url, {
            headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
        });
        return response.data.map(toOperatorUser);
    };
    const {data, error} = useSWR<OperatorUser[], AxiosError>(USERS_ENDPOINT, fetcher, {
        dedupingInterval: 60000
    });

    if (data === undefined) return {data, error};
    return {data: data.map((user) => ({name: user.name, username: user.username})), error};
};
