import React from 'react';

import {useFulfillmentOrderPicks} from '../../../../hooks/fulfillment-orders';
import type {
    FulfillmentOrderLinePick,
    FulfillmentOrderPosition,
    OrderType
} from '../../../../hooks/fulfillment-orders/types';
import {CurrentOrder} from './current-order';
import {ItemCardRow, ItemCards, type ItemCard} from './item-cards';

const OrderItem: React.FC<{item: ItemCard; position: FulfillmentOrderPosition}> = function ({item, position}) {
    const {data: picks} = useFulfillmentOrderPicks(item.id);
    if (picks === undefined) return <ItemCardRow item={{...item, valueRight: 'Loading...', disabled: true}} />;
    const pickedQuantity: number = picks
        .filter((pick: FulfillmentOrderLinePick) => pick.position_code === position.position)
        .reduce(
            (previousValue: number, currentValue: FulfillmentOrderLinePick) =>
                previousValue + currentValue.quantity_picked,
            0
        );
    const order: OrderType | undefined = position.orders.find((order: OrderType) => order.id === item.id);
    console.assert(order !== undefined);

    const valueRight: string = `${pickedQuantity}/${order!.quantity}`;
    const disabled: boolean = pickedQuantity >= order!.quantity;

    return <ItemCardRow item={{...item, valueRight, disabled}} />;
};

export const Orders: React.FC<{
    position: FulfillmentOrderPosition;
    currentOrder: OrderType | null;
    onSelectOrder: (order: OrderType) => void;
}> = function ({position, currentOrder, onSelectOrder}) {
    const items: ItemCard[] = position.orders.map((order: OrderType) => {
        const handleClick = function () {
            onSelectOrder(order);
        };

        return {
            id: order.id,
            title: 'Order',
            value: order.id,
            titleRight: 'Picked',
            valueRight: '',
            disabled: true,
            onClick: handleClick
        };
    });

    return currentOrder === null ? (
        <ItemCards>
            {items.map((item) => (
                <OrderItem key={item.id} item={item} position={position} />
            ))}
        </ItemCards>
    ) : (
        <CurrentOrder order={currentOrder} position={position} />
    );
};
