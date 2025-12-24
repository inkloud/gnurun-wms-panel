import useSWR from 'swr';

import {getOperations} from '../../api/operations';
import type {Operation} from './types';

export const useOperations = function (): Operation[] | undefined {
    const fetcher = async function (_: 'OPERATIONS'): Promise<Operation[]> {
        void _;
        return getOperations();
    };
    const {data} = useSWR<Operation[]>('OPERATIONS', fetcher, {dedupingInterval: 60000});

    return data;
};
