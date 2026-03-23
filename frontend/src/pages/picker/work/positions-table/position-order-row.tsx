import {useFulfillmentOrderPicks} from '../../../../hooks/fulfillment-orders';
import type {
    FulfillmentOrderLinePick,
    FulfillmentOrderPosition,
    OrderType
} from '../../../../hooks/fulfillment-orders/types';
import {AssignmentBadge} from '../../ui';
import {ProgressBadge} from './progress-badge';

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

export const PositionOrderRow: React.FC<{
    position: FulfillmentOrderPosition;
    order: OrderType;
    isFirst: boolean;
}> = function ({position, order, isFirst}) {
    const {data} = useFulfillmentOrderPicks(order.id);
    const allPicks: FulfillmentOrderLinePick[] = data === undefined ? [] : data;
    const picks: FulfillmentOrderLinePick[] = allPicks.filter((lp) => lp.position_code === position.position);
    const pickedQuantity = picks.reduce((sum, pick) => sum + pick.quantity_picked, 0);

    return (
        <div className={isFirst ? '' : 'border-top pt-3 mt-3'}>
            <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="badge text-bg-light text-body-emphasis">{order.id}</span>
                <ProgressBadge pickedQuantity={pickedQuantity} totalQuantity={order.quantity} />
            </div>
            <Picks picks={picks} />
        </div>
    );
};
