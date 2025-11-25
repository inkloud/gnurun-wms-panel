import {AxiosError} from 'axios';
import useSWR from 'swr';

import {useAuth} from '../auth';
import {AssignmentMode, doAssign, getFulfillmentOrders} from './api';
import type {FulfillmentOrder} from './types';

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

export const useFulfillmentOrders = function (): {
    data: FulfillmentOrder[] | undefined;
    error: AxiosError | undefined;
    actions: {assign: (id: string) => Promise<void>; unassign: (id: string) => Promise<void>};
} {
    const {data: authData} = useAuth();
    const token = authData!.access_token;

    const fetcher = async function ([_, token]: ['FULFILLMENT_ORDERS_ENDPOINT', string]): Promise<FulfillmentOrder[]> {
        return getFulfillmentOrders(token);
    };
    const {data, error, mutate} = useSWR<FulfillmentOrder[], AxiosError>(
        ['FULFILLMENT_ORDERS_ENDPOINT', token],
        fetcher,
        {dedupingInterval: 60000}
    );

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
