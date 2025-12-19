import React from 'react';

import type {FulfillmentOrderPosition, OrderType} from '../../../../hooks/fulfillment-orders/types';

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

const CurrentOrder: React.FC<{order: OrderType; onConfirm: (q: number) => void}> = function ({order, onConfirm}) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        inputRef.current!.select();
    }, [inputRef.current]);
    const [quantity, setQuantity] = React.useState<number>(order.quantity);
    React.useEffect(() => {
        setQuantity(order.quantity);
    }, [order.id, order.quantity]);

    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        setQuantity(e.target.value === '' ? 0 : Number(e.target.value));
    };

    const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onConfirm(quantity);
    };

    return (
        <div className="d-flex flex-column gap-3">
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="number"
                        min={0}
                        max={order.quantity}
                        step={1}
                        className="form-control form-control-lg text-center fs-1 fw-bold mx-auto"
                        style={{maxWidth: 180}}
                        value={quantity}
                        onChange={handleChange}
                        onFocus={(e) => e.currentTarget.select()}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="btn btn-success btn-lg mt-3 d-flex justify-content-center align-items-center gap-2 mx-auto"
                        style={{maxWidth: 180}}
                    >
                        {order.id}
                    </button>
                </form>
            </div>
        </div>
    );
};

export const Orders: React.FC<{position: FulfillmentOrderPosition}> = function ({position}) {
    const [currentOrder, setCurrentOrder] = React.useState<OrderType | null>(null);

    const handleConfirm = function (quantity_picked: number) {
        console.log({
            fulfillment_order_id: currentOrder!.id,
            position_code: position.position,
            quantity_picked,
            sku: position.product.sku
        });
    };

    const list = position.orders.map((order) => {
        const handleClick = function () {
            setCurrentOrder(order);
        };

        return <OrderCard key={order.id} order={order} onClick={handleClick} />;
    });
    return (
        <div className="d-flex flex-column gap-2">
            {currentOrder === null ? list : <CurrentOrder order={currentOrder} onConfirm={handleConfirm} />}
        </div>
    );
};
