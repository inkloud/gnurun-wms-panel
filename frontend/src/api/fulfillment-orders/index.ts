import axios from 'axios';
import {z} from 'zod';

import type {
    FulfillmentOrder,
    FulfillmentOrderPosition,
    FulfillmentOrderProduct
} from '../../hooks/fulfillment-orders/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const FULFILLMENT_ORDERS_ENDPOINT = `${API_BASE_URL}/picker/fulfillment_orders`;

const FulfillmentOrderApiSchema = z.object({
    id: z.string(),
    date: z.preprocess((value: string) => new Date(value), z.date()),
    assigned_to: z.array(z.string())
});
type FulfillmentOrderApiInput = z.input<typeof FulfillmentOrderApiSchema>;
type FulfillmentOrderApiOutput = z.output<typeof FulfillmentOrderApiSchema>;

const FulfillmentOrderProductSchema = z.object({
    id: z.string(),
    sku: z.string(),
    name: z.string(),
    quantity: z.number(),
    fulfillment_order_id: z.string(),
    position: z.string()
});
type FulfillmentOrderProductInput = z.input<typeof FulfillmentOrderProductSchema>;
const toFulfillmentOrderProduct = function (item: FulfillmentOrderProductInput): FulfillmentOrderProduct {
    const parsed = FulfillmentOrderProductSchema.parse(item);
    return {
        id: parsed.id,
        sku: parsed.sku,
        name: parsed.name,
        quantity: parsed.quantity,
        fulfillment_order_id: parsed.fulfillment_order_id,
        position: parsed.position
    };
};

export const getFulfillmentOrderProducts = async function (
    token: string,
    fulfillmentOrderId: string
): Promise<FulfillmentOrderProduct[]> {
    const response = await axios.get<FulfillmentOrderProductInput[]>(
        FULFILLMENT_ORDERS_ENDPOINT + `/${fulfillmentOrderId}/products`,
        {
            headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
        }
    );
    return response.data.map(toFulfillmentOrderProduct);
};

const FulfillmentOrderPositionSchema = z.object({
    position: z.string(),
    product: z.object({id: z.string(), sku: z.string(), name: z.string()}),
    orders: z.array(z.object({id: z.string(), quantity: z.number()}))
});

type FulfillmentOrderPositionInput = z.input<typeof FulfillmentOrderPositionSchema>;

type FulfillmentOrderPositionOutput = z.output<typeof FulfillmentOrderPositionSchema>;

const toFulfillmentOrderPosition = function (item: FulfillmentOrderPositionInput): FulfillmentOrderPositionInput {
    const parsed: FulfillmentOrderPositionOutput = FulfillmentOrderPositionSchema.parse(item);
    return {position: parsed.position, product: {...parsed.product}, orders: parsed.orders.map((o) => ({...o}))};
};

export const getFulfillmentOrderPositions = async function (
    token: string,
    fulfillmentOrderIdList: string[]
): Promise<FulfillmentOrderPosition[]> {
    const response = await axios.get<FulfillmentOrderPositionInput[]>(
        FULFILLMENT_ORDERS_ENDPOINT + `/${fulfillmentOrderIdList.join(',')}/positions`,
        {headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}}
    );
    return response.data.map(toFulfillmentOrderPosition);
};

const toFulfillmentOrder = function (order: FulfillmentOrderApiInput): FulfillmentOrder {
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
