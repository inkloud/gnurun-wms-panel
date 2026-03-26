import React from 'react';

import {useFulfillmentOrdersPicks} from '../../../../hooks/fulfillment-orders';
import type {
    FulfillmentOrderLinePick,
    FulfillmentOrderPosition,
    OrderType
} from '../../../../hooks/fulfillment-orders/types';
import {CurrentOrder} from './current-order';
import {ItemCards, type ItemCard} from './item-cards';

const usePickedByOrderId = function (position: FulfillmentOrderPosition): Record<string, number> {
    const orderIds: string[] = position.orders.map((order) => order.id);
    const picks: FulfillmentOrderLinePick[] | undefined = useFulfillmentOrdersPicks(orderIds);
    const pickedByOrderId: Record<string, number> = {};

    for (const pick of picks !== undefined ? picks : []) {
        if (pick.position_code !== position.position) continue;
        pickedByOrderId[pick.fulfillment_order_id] =
            (pickedByOrderId[pick.fulfillment_order_id] ?? 0) + pick.quantity_picked;
    }

    return pickedByOrderId;
};

export const Orders: React.FC<{
    position: FulfillmentOrderPosition;
    currentOrder: OrderType | null;
    onSelectOrder: (order: OrderType) => void;
}> = function ({position, currentOrder, onSelectOrder}) {
    const pickedByOrderId: Record<string, number> = usePickedByOrderId(position);

    const items: ItemCard[] = position.orders.map((order: OrderType) => {
        const handleClick = function () {
            onSelectOrder(order);
        };
        const pickedQuantity: number = pickedByOrderId[order.id] ?? 0;
        const isDisabled: boolean = pickedQuantity >= order.quantity;

        return {
            id: order.id,
            title: 'Order',
            value: order.id,
            titleRight: 'Picked',
            valueRight: `${pickedQuantity}/${order.quantity}`,
            disabled: isDisabled,
            onClick: handleClick
        };
    });

    return currentOrder === null ? (
        <ItemCards items={items} />
    ) : (
        <CurrentOrder order={currentOrder} position={position} />
    );
};
