import axios from 'axios';
import {z} from 'zod';

import type {OperatorUser} from '../hooks/wh-operators/types';

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

export const getOperators = async function (token: string): Promise<OperatorUser[]> {
    const response = await axios.get<UsersApiSchemaInput[]>(USERS_ENDPOINT, {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
    });
    return response.data.map(toOperatorUser);
};
