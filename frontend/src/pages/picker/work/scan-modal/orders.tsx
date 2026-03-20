import React from 'react';

import type {FulfillmentOrderPosition, OrderType} from '../../../../hooks/fulfillment-orders/types';
import {CurrentOrder} from './current-order';

const OrderCard: React.FC<{order: OrderType; onClick: () => void}> = function ({order, onClick}) {
    return (
        <div className="card" style={{cursor: 'pointer'}} onClick={onClick}>
            <div className="card-body d-flex justify-content-between align-items-center py-2">
                <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small fw-semibold">Order</span>
                    <span className="badge text-bg-light align-self-start">{order.id}</span>
                </div>
                <div className="text-end">
                    <span className="text-uppercase text-muted small d-block">Quantity</span>
                    <span className="fw-semibold fs-5">x{order.quantity}</span>
                </div>
            </div>
        </div>
    );
};

export const Orders: React.FC<{position: FulfillmentOrderPosition}> = function ({position}) {
    const [currentOrder, setCurrentOrder] = React.useState<OrderType | null>(null);

    const list = position.orders.map((order) => {
        const handleClick = function () {
            setCurrentOrder(order);
        };

        return <OrderCard key={order.id} order={order} onClick={handleClick} />;
    });
    return (
        <div className="d-flex flex-column gap-2">
            {currentOrder === null ? list : <CurrentOrder order={currentOrder} position={position} />}
        </div>
    );
};
