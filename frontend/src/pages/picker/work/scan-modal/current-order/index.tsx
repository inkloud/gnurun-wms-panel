import React from 'react';

import {useFulfillmentOrderPicks} from '../../../../../hooks/fulfillment-orders';
import type {FulfillmentOrderPosition, OrderType} from '../../../../../hooks/fulfillment-orders/types';
import {QuantityStep} from './quantity-step';
import {SerialScanStep} from './serial-scan-step';

export const CurrentOrder: React.FC<{order: OrderType; position: FulfillmentOrderPosition}> = function ({
    order,
    position
}) {
    const [quantity, setQuantity] = React.useState<number>(order.quantity);
    const [serialNumbers, setSerialNumbers] = React.useState<string[]>([]);
    const [isSerialStep, setIsSerialStep] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        setQuantity(order.quantity);
        setSerialNumbers([]);
        setIsSerialStep(false);
        setError(null);
    }, [order.id, order.quantity, position.position]);

    const {actions} = useFulfillmentOrderPicks(order.id);

    const handleQuantitySubmit = function (nextQuantity: number) {
        if (nextQuantity <= 0) {
            setError('Quantity must be greater than zero.');
            return;
        }
        setQuantity(nextQuantity);
        if (position.product.requires_serial_tracking) {
            setIsSerialStep(true);
            setError(null);
            return;
        }
        actions.pick(position.position, order.id, nextQuantity);
    };

    const handleSerialSubmit = function (serialNumber: string) {
        if (serialNumber.length === 0) {
            setError('Serial number cannot be empty.');
            return;
        }
        if (serialNumbers.includes(serialNumber)) {
            setError('This serial number has already been scanned.');
            return;
        }
        if (serialNumbers.length >= quantity) {
            setError('All required serial numbers have already been scanned.');
            return;
        }

        setSerialNumbers((current) => [...current, serialNumber]);
        setError(null);
    };

    const handleConfirmSerials = function () {
        actions.pick(position.position, order.id, quantity, serialNumbers);
    };

    const handleBack = function () {
        setIsSerialStep(false);
        setSerialNumbers([]);
        setError(null);
    };

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-start gap-2">
                <div className="d-flex flex-column">
                    <span className="badge text-bg-light align-self-start">{order.id}</span>
                </div>
                {isSerialStep ? (
                    <span className="badge text-bg-secondary">
                        {serialNumbers.length}/{quantity}
                    </span>
                ) : null}
            </div>
            {!isSerialStep ? (
                <QuantityStep
                    orderId={order.id}
                    maxQuantity={order.quantity}
                    initialQuantity={quantity}
                    requiresSerialTracking={position.product.requires_serial_tracking}
                    error={error}
                    onSubmit={handleQuantitySubmit}
                />
            ) : (
                <SerialScanStep
                    quantity={quantity}
                    serialNumbers={serialNumbers}
                    error={error}
                    onSubmit={handleSerialSubmit}
                    onBack={handleBack}
                    onConfirm={handleConfirmSerials}
                />
            )}
        </div>
    );
};
