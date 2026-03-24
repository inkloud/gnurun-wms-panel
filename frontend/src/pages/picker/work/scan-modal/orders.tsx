import React from 'react';

import {useFulfillmentOrdersPicks} from '../../../../hooks/fulfillment-orders';
import type {
    FulfillmentOrderLinePick,
    FulfillmentOrderPosition,
    OrderType
} from '../../../../hooks/fulfillment-orders/types';
import {CurrentOrder} from './current-order';

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

const OrderCard: React.FC<{
    order: OrderType;
    pickedQuantity: number;
    onClick: () => void;
}> = function ({order, pickedQuantity, onClick}) {
    const isDisabled = pickedQuantity >= order.quantity;

    return (
        <div
            className={`card ${isDisabled ? 'opacity-50' : ''}`}
            style={{cursor: isDisabled ? 'default' : 'pointer'}}
            onClick={isDisabled ? undefined : onClick}
            aria-disabled={isDisabled}
        >
            <div className="card-body d-flex justify-content-between align-items-center py-2">
                <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small fw-semibold">Order</span>
                    <span className="badge text-bg-light align-self-start">{order.id}</span>
                </div>
                <div className="text-end">
                    <span className="text-uppercase text-muted small d-block">Picked</span>
                    <span className="fw-semibold fs-5">
                        {pickedQuantity}/{order.quantity}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const Orders: React.FC<{position: FulfillmentOrderPosition}> = function ({position}) {
    const [currentOrder, setCurrentOrder] = React.useState<OrderType | null>(null);
    const pickedByOrderId: Record<string, number> = usePickedByOrderId(position);

    const list = position.orders.map((order) => {
        const handleClick = function () {
            setCurrentOrder(order);
        };
        const pickedQuantity = pickedByOrderId[order.id] ?? 0;

        return <OrderCard key={order.id} order={order} pickedQuantity={pickedQuantity} onClick={handleClick} />;
    });
    return (
        <div className="d-flex flex-column gap-2">
            {currentOrder === null ? list : <CurrentOrder order={currentOrder} position={position} />}
        </div>
    );
};
