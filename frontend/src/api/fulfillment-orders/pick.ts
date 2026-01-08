import axios from 'axios';
import {z} from 'zod';

import type {FulfillmentOrderLinePick} from '../../hooks/fulfillment-orders/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const FULFILLMENT_ORDERS_ENDPOINT = `${API_BASE_URL}/picker/fulfillment_orders`;

const FulfillmentOrderLinePickSchema = z.object({
    operator_id: z.string(),
    fulfillment_order_id: z.string(),
    sku: z.string(),
    position_code: z.string(),
    quantity_picked: z.number(),
    picked_at: z.preprocess((value: string) => new Date(value), z.date())
});
type FulfillmentOrderLinePickInput = z.input<typeof FulfillmentOrderLinePickSchema>;
type FulfillmentOrderLinePickOutput = z.output<typeof FulfillmentOrderLinePickSchema>;

const toFulfillmentOrderLinePick = function (item: FulfillmentOrderLinePickInput): FulfillmentOrderLinePick {
    const parsed: FulfillmentOrderLinePickOutput = FulfillmentOrderLinePickSchema.parse(item);
    return {
        operator_id: parsed.operator_id,
        fulfillment_order_id: parsed.fulfillment_order_id,
        sku: parsed.sku,
        position_code: parsed.position_code,
        quantity_picked: parsed.quantity_picked,
        picked_at: new Date(parsed.picked_at)
    };
};

export const getFulfillmentOrderPicks = async function (
    token: string,
    fulfillmentOrderId: string
): Promise<FulfillmentOrderLinePick[]> {
    const response = await axios.get<FulfillmentOrderLinePickInput[]>(
        FULFILLMENT_ORDERS_ENDPOINT + `/${fulfillmentOrderId}/pick`,
        {headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}}
    );
    return response.data.map(toFulfillmentOrderLinePick);
};

export const createFulfillmentOrderPick = async function (
    token: string,
    payload: {position_code: string; fulfillment_order_id: string; qty: number}
): Promise<FulfillmentOrderLinePick> {
    const response = await axios.post<FulfillmentOrderLinePickInput>(`${API_BASE_URL}/picker/pick`, payload, {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
    });
    return toFulfillmentOrderLinePick(response.data);
};
