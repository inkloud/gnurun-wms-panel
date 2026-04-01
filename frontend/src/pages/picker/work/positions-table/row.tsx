import React from 'react';

import type {FulfillmentOrderPosition, OrderType} from '../../../../hooks/fulfillment-orders/types';
import {PositionOrderRow} from './position-order-row';

const getCardAccentClass = function (pickedQuantity: number, totalQuantity: number): string {
    if (totalQuantity > 0 && pickedQuantity >= totalQuantity) return 'border-success-subtle';
    if (pickedQuantity > 0) return 'border-warning-subtle';
    return '';
};

const PositionProgress: React.FC<{pickedQuantity: number; totalQuantity: number}> = function ({
    pickedQuantity,
    totalQuantity
}) {
    const safePickedQuantity = Math.min(pickedQuantity, totalQuantity);
    const pickedPercent = totalQuantity > 0 ? (safePickedQuantity / totalQuantity) * 100 : 0;
    const remainingPercent = Math.max(0, 100 - pickedPercent);

    return (
        <div className="d-flex flex-column gap-1">
            <div className="progress-stacked" style={{height: '0.5rem'}}>
                <div className="progress" style={{width: `${pickedPercent}%`}}>
                    <div className="progress-bar bg-success" />
                </div>
                <div className="progress" style={{width: `${remainingPercent}%`}}>
                    <div className="progress-bar bg-secondary-subtle" />
                </div>
            </div>
            <div className="small text-muted text-end">{`${safePickedQuantity}/${totalQuantity} picked`}</div>
        </div>
    );
};

export const PositionCard: React.FC<{position: FulfillmentOrderPosition}> = function ({position}) {
    const [pickedByOrderId, setPickedByOrderId] = React.useState<Record<string, number>>({});
    const positionOrderIds: string = position.orders.map((order: OrderType) => order.id).join(',');

    React.useEffect(() => {
        setPickedByOrderId({});
    }, [position.position, positionOrderIds]);

    const handlePickedQuantityChange = function (orderId: string, pickedQuantity: number) {
        setPickedByOrderId((current: Record<string, number>) => {
            if (current[orderId] === pickedQuantity) return current;
            return {...current, [orderId]: pickedQuantity};
        });
    };

    const pickedPositionQuantity = position.orders.reduce((sum, order) => sum + (pickedByOrderId[order.id] ?? 0), 0);
    const totalUnits = position.orders.reduce((sum, order) => sum + order.quantity, 0);
    const cardAccentClass = getCardAccentClass(pickedPositionQuantity, totalUnits);

    return (
        <div className={`card shadow-sm ${cardAccentClass}`}>
            <div className="card-body d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-start gap-3">
                    <div className="d-flex flex-column gap-1">
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <span className="badge text-bg-secondary px-3 py-2 fs-6">{position.position}</span>
                            <span className="text-muted small">
                                {position.orders.length} order{position.orders.length === 1 ? '' : 's'}
                            </span>
                        </div>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <span className="d-inline-flex align-items-center gap-1">
                                <span className="fw-semibold font-monospace small">{position.product.sku}</span>
                                {position.product.requires_serial_tracking ? (
                                    <span
                                        className="fw-semibold text-warning-emphasis"
                                        title="Serial number required"
                                        aria-label="Serial number required"
                                    >
                                        *
                                    </span>
                                ) : null}
                            </span>
                        </div>
                        <span className="text-muted small">{position.product.name}</span>
                    </div>
                    <div className="flex-grow-1" style={{maxWidth: 220}}>
                        <PositionProgress pickedQuantity={pickedPositionQuantity} totalQuantity={totalUnits} />
                    </div>
                </div>
                {position.orders.length === 0 ? (
                    <div className="text-muted small">No order lines for this position.</div>
                ) : (
                    <div className="d-flex flex-column">
                        {position.orders.map((order, idx) => (
                            <PositionOrderRow
                                key={`${position.position}-${order.id}-${idx}`}
                                position={position}
                                order={order}
                                isFirst={idx === 0}
                                onPickedQuantityChange={handlePickedQuantityChange}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
