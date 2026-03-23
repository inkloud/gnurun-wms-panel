import {useFulfillmentOrdersPicks} from '../../../../hooks/fulfillment-orders';
import type {FulfillmentOrderLinePick, FulfillmentOrderPosition} from '../../../../hooks/fulfillment-orders/types';
import {PositionOrderRow} from './position-order-row';
import {ProgressBadge} from './progress-badge';

const getCardAccentClass = function (pickedQuantity: number, totalQuantity: number): string {
    if (totalQuantity > 0 && pickedQuantity >= totalQuantity) return 'border-success-subtle';
    if (pickedQuantity > 0) return 'border-warning-subtle';
    return '';
};

export const PositionCard: React.FC<{position: FulfillmentOrderPosition}> = function ({position}) {
    const positionOrderIds = position.orders.map((order) => order.id);
    const positionPicksData = useFulfillmentOrdersPicks(positionOrderIds);
    const allPositionPicks: FulfillmentOrderLinePick[] = positionPicksData === undefined ? [] : positionPicksData;
    const pickedPositionQuantity = allPositionPicks
        .filter((lp) => lp.position_code === position.position)
        .reduce((sum, pick) => sum + pick.quantity_picked, 0);
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
                    <ProgressBadge pickedQuantity={pickedPositionQuantity} totalQuantity={totalUnits} />
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
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
