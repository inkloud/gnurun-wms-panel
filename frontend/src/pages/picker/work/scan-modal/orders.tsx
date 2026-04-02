import React from 'react';

import {useFulfillmentOrderPicks} from '../../../../hooks/fulfillment-orders';
import type {
    FulfillmentOrderLinePick,
    FulfillmentOrderPosition,
    OrderType
} from '../../../../hooks/fulfillment-orders/types';
import {CurrentOrder} from './current-order';
import {ItemCardRow, ItemCards, type ItemCard} from './item-cards';

const LoadedOrderItem: React.FC<{
    order: OrderType;
    position_code: string;
    picks: FulfillmentOrderLinePick[];
    onClick: () => void;
}> = function ({order, position_code, picks, onClick}) {
    const pickedQuantity: number = picks
        .filter((pick: FulfillmentOrderLinePick) => pick.position_code === position_code)
        .reduce(
            (previousValue: number, currentValue: FulfillmentOrderLinePick) =>
                previousValue + currentValue.quantity_picked,
            0
        );
    const valueRight: string = `${pickedQuantity}/${order.quantity}`;
    const disabled: boolean = pickedQuantity >= order.quantity;

    const item: ItemCard = {
        id: order.id,
        title: 'Order',
        value: order.id,
        titleRight: 'Picked',
        valueRight,
        disabled,
        onClick
    };
    return <ItemCardRow item={item} />;
};

const OrderItem: React.FC<{order: OrderType; position_code: string; onClick: () => void}> = function ({
    order,
    position_code,
    onClick
}) {
    const {data: picks} = useFulfillmentOrderPicks(order.id);

    const item: ItemCard = {
        id: order.id,
        title: 'Order',
        value: order.id,
        titleRight: 'Picked',
        valueRight: 'Loading...',
        disabled: true,
        onClick
    };
    if (picks === undefined) return <ItemCardRow item={item} />;
    return <LoadedOrderItem order={order} position_code={position_code} picks={picks} onClick={onClick} />;
};

export const Orders: React.FC<{
    position: FulfillmentOrderPosition;
    currentOrder: OrderType | null;
    onSelectOrder: (order: OrderType) => void;
}> = function ({position, currentOrder, onSelectOrder}) {
    const items = position.orders.map((order: OrderType) => {
        const handleClick = function () {
            onSelectOrder(order);
        };

        return <OrderItem key={order.id} order={order} position_code={position.position} onClick={handleClick} />;
    });

    return currentOrder === null ? (
        <ItemCards>{items}</ItemCards>
    ) : (
        <CurrentOrder order={currentOrder} position={position} />
    );
};
