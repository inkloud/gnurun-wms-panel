import axios from 'axios';

import type {FulfillmentOrder} from '../../hooks/fulfillment-orders/types';
import {API_BASE_URL} from '../config';
import {toFulfillmentOrder, type FulfillmentOrderApiInput} from './utils';

const ASSIGN_ENDPOINT = `${API_BASE_URL}/picker/assign`;
const UNASSIGN_ENDPOINT = `${API_BASE_URL}/picker/unassign`;

export enum AssignmentMode {
    ASSIGN = 'ASSIGN',
    UNASSIGN = 'UNASSIGN'
}

export const doAssign = async function (id: string, token: string, mode: AssignmentMode): Promise<FulfillmentOrder> {
    const END_POINT = mode === AssignmentMode.ASSIGN ? ASSIGN_ENDPOINT : UNASSIGN_ENDPOINT;
    const response = await axios.put<FulfillmentOrderApiInput>(`${END_POINT}/${id}`, undefined, {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
    });
    return toFulfillmentOrder(response.data);
};
