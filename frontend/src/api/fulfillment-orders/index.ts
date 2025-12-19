import axios from 'axios';
import {z} from 'zod';

import type {
    FulfillmentOrder,
    FulfillmentOrderLine,
    FulfillmentOrderPosition
} from '../../hooks/fulfillment-orders/types';
import {toFulfillmentOrder, type FulfillmentOrderApiInput} from './utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const FULFILLMENT_ORDERS_ENDPOINT = `${API_BASE_URL}/picker/fulfillment_orders`;

const FulfillmentOrderLineSchema = z.object({
    sku: z.string(),
    name: z.string(),
    fulfillment_order_id: z.string(),
    position_code: z.string(),
    quantity_required: z.number()
});
type FulfillmentOrderLineInput = z.input<typeof FulfillmentOrderLineSchema>;
type FulfillmentOrderLineOutput = z.output<typeof FulfillmentOrderLineSchema>;
const toFulfillmentOrderLine = function (item: FulfillmentOrderLineInput): FulfillmentOrderLine {
    const parsed: FulfillmentOrderLineOutput = FulfillmentOrderLineSchema.parse(item);
    return {
        sku: parsed.sku,
        name: parsed.name,
        fulfillment_order_id: parsed.fulfillment_order_id,
        position_code: parsed.position_code,
        quantity_required: parsed.quantity_required
    };
};

export const getFulfillmentOrderLines = async function (
    token: string,
    fulfillmentOrderId: string
): Promise<FulfillmentOrderLine[]> {
    const response = await axios.get<FulfillmentOrderLineInput[]>(
        FULFILLMENT_ORDERS_ENDPOINT + `/${fulfillmentOrderId}/products`,
        {
            headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
        }
    );
    return response.data.map(toFulfillmentOrderLine);
};

const FulfillmentOrderPositionSchema = z.object({
    position: z.string(),
    product: z.object({sku: z.string(), name: z.string()}),
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

export const getFulfillmentOrders = async function (token: string): Promise<FulfillmentOrder[]> {
    const response = await axios.get<FulfillmentOrderApiInput[]>(FULFILLMENT_ORDERS_ENDPOINT, {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
    });
    return response.data.map(toFulfillmentOrder);
};
