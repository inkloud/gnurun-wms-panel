import {useFulfillmentOrderPicks, useFulfillmentOrdersPicks} from '../../../../hooks/fulfillment-orders';
import type {FulfillmentOrderLinePick, FulfillmentOrderPosition} from '../../../../hooks/fulfillment-orders/types';
import {AssignmentBadge} from '../../ui';

const ProgressBadge: React.FC<{pickedQuantity: number; totalQuantity: number}> = function ({
    pickedQuantity,
    totalQuantity
}) {
    const isCompleted = totalQuantity > 0 && pickedQuantity >= totalQuantity;
    const isPartial = pickedQuantity > 0 && !isCompleted;
    const badgeClass = isCompleted
        ? 'bg-success-subtle text-success-emphasis border border-success-subtle'
        : isPartial
          ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
          : 'text-bg-light text-body-emphasis';

    return <span className={`badge ${badgeClass}`}>{`${pickedQuantity}/${totalQuantity}`}</span>;
};

const Picks: React.FC<{picks: FulfillmentOrderLinePick[]}> = function ({picks}) {
    if (picks.length === 0) return null;

    return (
        <div className="d-flex flex-wrap gap-2 mt-2">
            {picks.map((lp: FulfillmentOrderLinePick, idx: number) => (
                <AssignmentBadge
                    key={`${lp.operator_id}-${idx}`}
                    username={lp.operator_id}
                    quantity={lp.quantity_picked}
                />
            ))}
        </div>
    );
};

export const TableRow: React.FC<{
    isFirst: boolean;
    position: FulfillmentOrderPosition;
    orderId: string;
    quantity: number;
    rowSpan: number;
    totalUnits: number;
}> = function ({isFirst, position, orderId, quantity, rowSpan, totalUnits}) {
    const positionOrderIds = position.orders.map((order) => order.id);
    const positionPicksData = useFulfillmentOrdersPicks(positionOrderIds);
    const {data} = useFulfillmentOrderPicks(orderId);
    const allPicks: FulfillmentOrderLinePick[] = data === undefined ? [] : data;
    const picks: FulfillmentOrderLinePick[] = allPicks.filter((lp) => lp.position_code === position.position);
    const pickedQuantity = picks.reduce((sum, pick) => sum + pick.quantity_picked, 0);
    const allPositionPicks: FulfillmentOrderLinePick[] = positionPicksData === undefined ? [] : positionPicksData;
    const pickedPositionQuantity = allPositionPicks
        .filter((lp) => lp.position_code === position.position)
        .reduce((sum, pick) => sum + pick.quantity_picked, 0);

    return (
        <tr>
            {isFirst ? (
                <>
                    <td rowSpan={rowSpan} className="align-top" style={{width: '200px'}}>
                        <div className="d-flex flex-column gap-1">
                            <span className="badge text-bg-secondary px-3 py-2 fs-6">{position.position}</span>
                            <span className="text-muted small">{position.orders.length} orders</span>
                            <div className="d-flex w-100 justify-content-between align-items-center gap-2">
                                <span className="fw-semibold font-monospace small">{position.product.sku}</span>
                                <ProgressBadge pickedQuantity={pickedPositionQuantity} totalQuantity={totalUnits} />
                            </div>
                            <span className="text-muted small">{position.product.name}</span>
                        </div>
                    </td>
                </>
            ) : null}
            <td>
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className="badge text-bg-light text-body-emphasis">{orderId}</span>
                    <ProgressBadge pickedQuantity={pickedQuantity} totalQuantity={quantity} />
                </div>
                <Picks picks={picks} />
            </td>
        </tr>
    );
};
