import React from 'react';

import {useFulfillmentOrderPicks} from '../../../../hooks/fulfillment-orders';
import type {
    FulfillmentOrderLinePick,
    FulfillmentOrderPosition,
    OrderType
} from '../../../../hooks/fulfillment-orders/types';
import {ItemCardRow, ItemCards, type ItemCard} from './item-cards';

const LoadedPositionOrderItem: React.FC<{
    order: OrderType;
    position_code: string;
    picks: FulfillmentOrderLinePick[];
    onDisable: (isDisabled: boolean) => void;
}> = function ({order, position_code, picks, onDisable}) {
    const pickedQuantity: number = picks
        .filter((pick: FulfillmentOrderLinePick) => pick.position_code === position_code)
        .reduce(
            (previousValue: number, currentValue: FulfillmentOrderLinePick) =>
                previousValue + currentValue.quantity_picked,
            0
        );
    const disabled = pickedQuantity >= order.quantity;
    React.useEffect(() => {
        onDisable(disabled);
    }, [disabled]);

    return null;
};

const PositionOrderItem: React.FC<{order: OrderType; position_code: string; onDisable: (isDisabled: boolean) => void}> =
    function ({order, position_code, onDisable}) {
        const {data: picks} = useFulfillmentOrderPicks(order.id);

        if (picks === undefined) return null;
        return (
            <LoadedPositionOrderItem order={order} position_code={position_code} picks={picks} onDisable={onDisable} />
        );
    };

const useDisabledByOrderId = function (position: FulfillmentOrderPosition) {
    const initValue: Record<string, boolean> = position.orders.reduce(
        (acc: Record<string, boolean>, curr: OrderType) => ({...acc, [curr.id]: true}),
        {}
    );
    const [disabledByOrderId, setDisabledByOrderId] = React.useState<Record<string, boolean>>(initValue);
    const set = function (key: string, value: boolean) {
        setDisabledByOrderId((current: Record<string, boolean>) => ({...current, [key]: value}));
    };

    const value: boolean = Object.values(disabledByOrderId).every(Boolean);
    return {set, value};
};

const PositionItem: React.FC<{
    position: FulfillmentOrderPosition;
    onClick: (v: FulfillmentOrderPosition) => void;
}> = function ({position, onClick}) {
    const {value: allDisabled, set: setDisabledByOrderId} = useDisabledByOrderId(position);

    const handleClick = function () {
        onClick(position);
    };

    const item: ItemCard = {
        id: `${position.product.sku}-${position.position}`,
        title: 'Position',
        value: position.position,
        titleRight: 'Orders',
        valueRight: position.orders.length,
        disabled: allDisabled,
        onClick: handleClick
    };

    const positionItems = position.orders.map((order: OrderType) => {
        const handleDisable = function (value: boolean) {
            setDisabledByOrderId(order.id, value);
        };

        return (
            <PositionOrderItem
                key={order.id}
                order={order}
                position_code={position.position}
                onDisable={handleDisable}
            />
        );
    });

    return (
        <>
            <ItemCardRow item={item} />
            {positionItems}
        </>
    );
};

export const PositionSelector: React.FC<{
    positions: FulfillmentOrderPosition[];
    onClick: (v: FulfillmentOrderPosition) => void;
}> = function ({positions, onClick}) {
    return (
        <ItemCards>
            {positions.map((position: FulfillmentOrderPosition) => (
                <PositionItem
                    key={`${position.product.sku}-${position.position}`}
                    position={position}
                    onClick={onClick}
                />
            ))}
        </ItemCards>
    );
};
