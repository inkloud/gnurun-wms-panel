import axios from 'axios';
import {z} from 'zod';

import type {FulfillmentOrder} from '../hooks/fulfillment-orders/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const FULFILLMENT_ORDERS_ENDPOINT = `${API_BASE_URL}/picker/fulfillment_orders`;

const FulfillmentOrderApiSchema = z.object({
    id: z.string(),
    date: z.preprocess((value: string) => new Date(value), z.date()),
    assigned_to: z.array(z.string())
});
type FulfillmentOrderApiInput = z.input<typeof FulfillmentOrderApiSchema>;
type FulfillmentOrderApiOutput = z.infer<typeof FulfillmentOrderApiSchema>;

export const toFulfillmentOrder = function (order: FulfillmentOrderApiInput): FulfillmentOrder {
    const e: FulfillmentOrderApiOutput = FulfillmentOrderApiSchema.parse(order);
    return {id: e.id, date: new Date(e.date), assigned_to: [...e.assigned_to]};
};

export const getFulfillmentOrders = async function (token: string): Promise<FulfillmentOrder[]> {
    const response = await axios.get<FulfillmentOrderApiInput[]>(FULFILLMENT_ORDERS_ENDPOINT, {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
    });
    return response.data.map(toFulfillmentOrder);
};

export enum AssignmentMode {
    ASSIGN = 'ASSIGN',
    UNASSIGN = 'UNASSIGN'
}

const ASSIGN_ENDPOINT = `${API_BASE_URL}/picker/assign`;
const UNASSIGN_ENDPOINT = `${API_BASE_URL}/picker/unassign`;

export const doAssign = async function (id: string, token: string, mode: AssignmentMode): Promise<FulfillmentOrder> {
    const END_POINT = mode === AssignmentMode.ASSIGN ? ASSIGN_ENDPOINT : UNASSIGN_ENDPOINT;
    const response = await axios.put<FulfillmentOrderApiInput>(`${END_POINT}/${id}`, undefined, {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
    });
    return toFulfillmentOrder(response.data);
};
