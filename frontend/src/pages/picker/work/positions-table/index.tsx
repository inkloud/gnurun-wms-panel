import type {FulfillmentOrderPosition} from '../../../../hooks/fulfillment-orders/types';
import {PositionCard} from './row';

export const PositionsTable: React.FC<{positions: FulfillmentOrderPosition[]}> = function ({positions}) {
    if (positions.length === 0)
        return <div className="text-muted text-center py-4">No positions assigned to your orders yet.</div>;

    return (
        <div className="d-flex flex-column gap-3 mt-4">
            {positions.map((position) => (
                <PositionCard key={position.position} position={position} />
            ))}
        </div>
    );
};
