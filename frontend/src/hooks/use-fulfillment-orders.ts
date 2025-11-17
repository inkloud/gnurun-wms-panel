import axios, {AxiosError} from 'axios';
import useSWR from 'swr';

import type {FulfillmentOrder} from '../entities/fulfillment-order';
import {useAuth} from './auth';

type FulfillmentOrderApi = {id: string; date: string; assigned_to: string[]};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const FULFILLMENT_ORDERS_ENDPOINT = `${API_BASE_URL}/picker/fulfillment_orders`;
const ASSIGN_ENDPOINT = `${API_BASE_URL}/picker/assign`;
const UNASSIGN_ENDPOINT = `${API_BASE_URL}/picker/unassign`;

enum AssignmentMode {
    ASSIGN = 'ASSIGN',
    UNASSIGN = 'UNASSIGN'
}

const toFulfillmentOrder = function (order: FulfillmentOrderApi): FulfillmentOrder {
    return {...order, date: new Date(order.date)};
};

const updateAssignments = function (
    orders: FulfillmentOrder[] | undefined,
    id: string,
    operator: string,
    mode: AssignmentMode
): FulfillmentOrder[] | undefined {
    if (orders === undefined) return undefined;
    return orders.map((order) => {
        if (order.id !== id) return order;
        const assigned = new Set(order.assigned_to);
        if (mode === AssignmentMode.ASSIGN) assigned.add(operator);
        if (mode === AssignmentMode.UNASSIGN) assigned.delete(operator);
        return {...order, assigned_to: Array.from(assigned)};
    });
};

const doAssign = async function (id: string, token: string, mode: AssignmentMode): Promise<FulfillmentOrder> {
    const END_POINT = mode === AssignmentMode.ASSIGN ? ASSIGN_ENDPOINT : UNASSIGN_ENDPOINT;
    const response = await axios.put<FulfillmentOrderApi>(`${END_POINT}/${id}`, undefined, {
        headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
    });
    return toFulfillmentOrder(response.data);
};

export const useFulfillmentOrders = function (): {
    data: FulfillmentOrder[] | undefined;
    error: AxiosError | undefined;
    actions: {assign: (id: string) => Promise<void>; unassign: (id: string) => Promise<void>};
} {
    const {data: authData} = useAuth();

    const fetcher = async function (url: string): Promise<FulfillmentOrder[]> {
        const token = authData!.access_token;

        const response = await axios.get<FulfillmentOrderApi[]>(url, {
            headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}
        });
        return response.data.map(toFulfillmentOrder);
    };

    const {data, error, mutate} = useSWR<FulfillmentOrder[], AxiosError>(FULFILLMENT_ORDERS_ENDPOINT, fetcher, {
        dedupingInterval: 60000
    });

    const _doAssign = function (id: string, mode: AssignmentMode) {
        const currentLogged = authData!.auth_user.username;
        const token = authData!.access_token;

        const updateFn = async function () {
            const res = await doAssign(id, token, mode);
            return data!.map((item) => (item.id !== id ? item : res));
        };
        try {
            mutate(updateFn, {optimisticData: updateAssignments(data, id, currentLogged, mode), revalidate: false});
        } catch (err) {
            mutate();
            throw err;
        }
    };
    const assign = async function (id: string) {
        _doAssign(id, AssignmentMode.ASSIGN);
    };
    const unassign = async function (id: string) {
        _doAssign(id, AssignmentMode.UNASSIGN);
    };

    return {data, error, actions: {assign, unassign}};
};
