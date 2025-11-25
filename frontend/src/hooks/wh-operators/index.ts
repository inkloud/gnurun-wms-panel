import {AxiosError} from 'axios';
import useSWR from 'swr';

import {getOperators} from '../../api/wh-operators';
import type {OperatorUser} from './types';

export const useWHOperators = function (token: string): {
    data: OperatorUser[] | undefined;
    error: AxiosError | undefined;
} {
    const fetcher = async function ([_, token]: ['USERS_ENDPOINT', string]): Promise<OperatorUser[]> {
        return getOperators(token);
    };
    const {data, error} = useSWR<OperatorUser[], AxiosError>(['USERS_ENDPOINT', token], fetcher, {
        dedupingInterval: 60000
    });

    if (data === undefined) return {data, error};
    return {data: data.map((user) => ({name: user.name, username: user.username})), error};
};
