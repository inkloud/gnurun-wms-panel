import {AxiosError} from 'axios';
import useSWR from 'swr';

import {
    getFulfillmentOrderLines,
    getFulfillmentOrderPositions,
    getFulfillmentOrders
} from '../../api/fulfillment-orders';
import {AssignmentMode, doAssign} from '../../api/fulfillment-orders/assign';
import {createFulfillmentOrderPick, getFulfillmentOrderPicks} from '../../api/fulfillment-orders/pick';
import {useAuth} from '../auth';
import type {FulfillmentOrder, FulfillmentOrderLine, FulfillmentOrderLinePick, FulfillmentOrderPosition} from './types';

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

    const fetcher = async function ([, token]: ['FULFILLMENT_ORDERS_ENDPOINT', string]): Promise<FulfillmentOrder[]> {
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

export const useFulfillmentOrderLines = function (id_list: Set<string>): FulfillmentOrderLine[] | undefined {
    const {data: authData} = useAuth();

    const token = authData!.access_token;
    const ids = [...id_list].sort();

    const fetcher = async function ([, token]: ['FULFILLMENT_ORDER_LINES', string, string]) {
        const res = await Promise.all(ids.map((id) => getFulfillmentOrderLines(token, id)));
        return res.flat();
    };

    const {data} = useSWR(['FULFILLMENT_ORDER_LINES', token, ids.join(', ')], fetcher, {
        dedupingInterval: 60000
    });
    return data;
};

export const useFulfillmentOrderPositions = function (
    id_list: Set<string> | undefined
): FulfillmentOrderPosition[] | undefined {
    type KEY = ['FULFILLMENT_ORDER_POSITIONS', string, string];

    const {data: authData} = useAuth();

    const token = authData!.access_token;

    const fetcher = async function ([, token, joined]: KEY) {
        return getFulfillmentOrderPositions(token, joined.split(','));
    };

    const key: KEY | null =
        id_list === undefined ? null : ['FULFILLMENT_ORDER_POSITIONS', token, [...id_list].sort().join(',')];
    const {data} = useSWR(key, fetcher, {dedupingInterval: 60000});
    return data;
};

export const useFulfillmentOrderPicks = function (id_list: Set<string> | undefined): {
    data: FulfillmentOrderLinePick[] | undefined;
    actions: {pick: (position_code: string, fulfillment_order_id: string, qty: number) => void};
} {
    type KEY = ['FULFILLMENT_ORDER_PICKS', string, string];

    const {data: authData} = useAuth();

    const token = authData!.access_token;

    const fetcher = async function ([, token, joined]: KEY) {
        return getFulfillmentOrderPicks(token, joined.split(','));
    };

    const key: KEY | null =
        id_list === undefined ? null : ['FULFILLMENT_ORDER_PICKS', token, [...id_list].sort().join(',')];
    const {data, mutate} = useSWR(key, fetcher, {dedupingInterval: 60000});

    const pick = async function (position_code: string, fulfillment_order_id: string, qty: number) {
        // console.log({
        //     operator_id: authData!.auth_user.username,
        //     fulfillment_order_id,
        //     sku: 'TODO',
        //     position_code,
        //     quantity_picked: qty,
        //     picked_at: new Date()
        // });
        const updateFn = async function () {
            const res: FulfillmentOrderLinePick = await createFulfillmentOrderPick(token, {
                position_code,
                fulfillment_order_id,
                qty
            });
            return [...data!, res];
        };
        try {
            mutate(updateFn);
        } catch (err) {
            mutate();
            throw err;
        }
    };
    return {data, actions: {pick}};
};
