import React from 'react';

import {useFulfillmentOrderPicks} from '../../../../../hooks/fulfillment-orders';
import type {FulfillmentOrderPosition, OrderType} from '../../../../../hooks/fulfillment-orders/types';
import {QuantityStep, SerialScanStep} from './steps';

export const CurrentOrder: React.FC<{order: OrderType; position: FulfillmentOrderPosition}> = function ({
    order,
    position
}) {
    const quantityInputRef = React.useRef<HTMLInputElement>(null);
    const serialInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        quantityInputRef.current?.select();
    }, []);

    const [quantity, setQuantity] = React.useState<number>(order.quantity);
    const [serialInput, setSerialInput] = React.useState<string>('');
    const [serialNumbers, setSerialNumbers] = React.useState<string[]>([]);
    const [isSerialStep, setIsSerialStep] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        setQuantity(order.quantity);
        setSerialInput('');
        setSerialNumbers([]);
        setIsSerialStep(false);
        setError(null);
    }, [order.id, order.quantity, position.position]);

    React.useEffect(() => {
        if (isSerialStep) serialInputRef.current?.focus();
        else quantityInputRef.current?.select();
    }, [isSerialStep]);

    const {actions} = useFulfillmentOrderPicks(order.id);

    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        setQuantity(e.target.value === '' ? 0 : Number(e.target.value));
        setError(null);
    };

    const handleSerialChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        setSerialInput(e.target.value);
    };

    const handleSubmit = function (e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (quantity <= 0) {
            setError('Quantity must be greater than zero.');
            return;
        }
        if (position.product.requires_serial_tracking) {
            setIsSerialStep(true);
            setError(null);
            return;
        }
        actions.pick(position.position, order.id, quantity);
    };

    const handleSerialSubmit = function (e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const normalized = serialInput.trim();

        if (normalized.length === 0) {
            setError('Serial number cannot be empty.');
            return;
        }
        if (serialNumbers.includes(normalized)) {
            setError('This serial number has already been scanned.');
            return;
        }
        if (serialNumbers.length >= quantity) {
            setError('All required serial numbers have already been scanned.');
            return;
        }

        setSerialNumbers((current) => [...current, normalized]);
        setSerialInput('');
        setError(null);
        serialInputRef.current?.focus();
    };

    const handleConfirmSerials = function () {
        actions.pick(position.position, order.id, quantity, serialNumbers);
    };

    const handleBack = function () {
        setIsSerialStep(false);
        setSerialInput('');
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
                    quantity={quantity}
                    quantityInputRef={quantityInputRef}
                    requiresSerialTracking={position.product.requires_serial_tracking}
                    error={error}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
            ) : (
                <SerialScanStep
                    quantity={quantity}
                    serialInput={serialInput}
                    serialNumbers={serialNumbers}
                    serialInputRef={serialInputRef}
                    error={error}
                    onChange={handleSerialChange}
                    onSubmit={handleSerialSubmit}
                    onBack={handleBack}
                    onConfirm={handleConfirmSerials}
                />
            )}
        </div>
    );
};
