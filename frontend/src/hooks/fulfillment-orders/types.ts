export type FulfillmentOrder = {id: string; created_at: Date; assigned_to: string[]};

export type FulfillmentOrderLine = {
    fulfillment_order_id: string;
    sku: string;
    position_code: string;
    quantity_required: number;
    name: string;
};

export type OrderType = {id: string; quantity: number};

export type FulfillmentOrderPosition = {
    position: string;
    product: {sku: string; name: string};
    orders: OrderType[];
};
