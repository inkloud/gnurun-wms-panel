import axios, {AxiosError} from 'axios';
import useSWR from 'swr';

import type {FulfillmentOrder} from '../entities/fulfillment-order';

type FulfillmentOrderApi = {id: string; date: string};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const FULFILLMENT_ORDERS_ENDPOINT = `${API_BASE_URL}/picker/fulfillment_orders`;

export const useFulfillmentOrders = function (token: string): {
    data: FulfillmentOrder[] | undefined;
    error: AxiosError | undefined;
} {
    const fetcher = async function (url: string): Promise<FulfillmentOrder[]> {
        const response = await axios.get<FulfillmentOrderApi[]>(url, {
            headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
        });
        return response.data.map((order) => ({...order, date: new Date(order.date)}));
    };

    const {data, error} = useSWR<FulfillmentOrder[], AxiosError>(FULFILLMENT_ORDERS_ENDPOINT, fetcher, {
        dedupingInterval: 60000
    });

    return {data, error};
};
