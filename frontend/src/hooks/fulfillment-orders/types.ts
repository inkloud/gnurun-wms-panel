export type FulfillmentOrder = {id: string; date: Date; assigned_to: string[]};

export type FulfillmentOrderProduct = {
    id: string;
    sku: string;
    name: string;
    quantity: number;
    fulfillment_order_id: string;
    position: string;
};

export type OrderType = {id: string; quantity: number};

export type FulfillmentOrderPosition = {
    position: string;
    product: {id: string; sku: string; name: string};
    orders: OrderType[];
};
