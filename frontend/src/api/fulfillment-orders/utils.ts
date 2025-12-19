import {z} from 'zod';

import type {FulfillmentOrder} from '../../hooks/fulfillment-orders/types';

export const FulfillmentOrderApiSchema = z.object({
    id: z.string(),
    created_at: z.preprocess((value: string) => new Date(value), z.date()),
    assigned_to: z.array(z.string())
});

export type FulfillmentOrderApiInput = z.input<typeof FulfillmentOrderApiSchema>;
type FulfillmentOrderApiOutput = z.output<typeof FulfillmentOrderApiSchema>;

export const toFulfillmentOrder = function (order: FulfillmentOrderApiInput): FulfillmentOrder {
    const e: FulfillmentOrderApiOutput = FulfillmentOrderApiSchema.parse(order);
    return {id: e.id, created_at: new Date(e.created_at), assigned_to: [...e.assigned_to]};
};
