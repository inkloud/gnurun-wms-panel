import useSWR from 'swr';

import {getOperations} from './api';
import type {Operation} from './types';

export const useOperations = function (): Operation[] | undefined {
    const fetcher = async function (_: 'OPERATIONS'): Promise<Operation[]> {
        return getOperations();
    };
    const {data} = useSWR<Operation[]>('OPERATIONS', fetcher, {dedupingInterval: 60000});

    return data;
};
