import {useFulfillmentOrderPicks} from '../../../../hooks/fulfillment-orders';
import type {FulfillmentOrderLinePick, FulfillmentOrderPosition} from '../../../../hooks/fulfillment-orders/types';
import {AssignmentBadge} from '../../ui';

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
    const {data} = useFulfillmentOrderPicks(orderId);
    const allPicks: FulfillmentOrderLinePick[] = data === undefined ? [] : data;
    const picks: FulfillmentOrderLinePick[] = allPicks.filter((lp) => lp.position_code === position.position);
    const pickedQuantity = picks.reduce((sum, pick) => sum + pick.quantity_picked, 0);
    const isCompleted = quantity > 0 && pickedQuantity >= quantity;
    const isPartial = pickedQuantity > 0 && !isCompleted;
    const orderBadgeClass = isCompleted
        ? 'bg-success-subtle text-success-emphasis border border-success-subtle'
        : isPartial
          ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
          : 'text-bg-light text-body-emphasis';
    const statusLabel = `${pickedQuantity}/${quantity}`;

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
                                <span className="fw-semibold text-body-secondary">×{totalUnits}</span>
                            </div>
                            <span className="text-muted small">{position.product.name}</span>
                        </div>
                    </td>
                </>
            ) : null}
            <td>
                <span className={`badge ${orderBadgeClass}`}>
                    {orderId}
                    {` · ${statusLabel}`}
                </span>
                <Picks picks={picks} />
            </td>
        </tr>
    );
};
