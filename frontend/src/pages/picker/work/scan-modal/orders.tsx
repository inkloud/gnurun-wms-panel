import React from 'react';

import type {OrderType} from '../../../../hooks/fulfillment-orders/types';

const PositionBadge: React.FC<{children: React.ReactNode}> = function ({children}) {
    return (
        <span
            className="badge text-bg-light align-self-start px-3 py-2 fs-6 text-center"
            style={{display: 'inline-block'}}
        >
            {children}
        </span>
    );
};

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

export const Orders: React.FC<{orders: OrderType[]}> = function ({orders}) {
    const [currentOrder, setCurrentPosition] = React.useState<OrderType | null>(null);

    console.log(currentOrder);

    const list = orders.map((order) => {
        const handleClick = function () {
            setCurrentPosition(order);
        };

        return <OrderCard key={order.id} order={order} onClick={handleClick} />;
    });
    return (
        <div className="d-flex flex-column gap-2">
            {currentOrder === null ? (
                list
            ) : (
                <h2>
                    <span className="badge text-bg-light align-self-start">{currentOrder.id}</span>
                </h2>
            )}
        </div>
    );
};
