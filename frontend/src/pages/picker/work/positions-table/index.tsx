import type {FulfillmentOrderPosition} from '../../../../hooks/fulfillment-orders/types';
import {TableRow} from './row';

export const PositionsTable: React.FC<{positions: FulfillmentOrderPosition[]}> = function ({positions}) {
    if (positions.length === 0)
        return <div className="text-muted text-center py-4">No positions assigned to your orders yet.</div>;

    const rows = positions.flatMap((position) => {
        const orders = position.orders.length > 0 ? position.orders : [{id: '—', quantity: 0}];
        const totalUnits = position.orders.reduce((sum, order) => sum + order.quantity, 0);
        const rowSpan = orders.length;
        return orders.map((order, idx) => (
            <TableRow
                key={`${position.position}-${order.id}-${idx}`}
                isFirst={idx === 0}
                position={position}
                orderId={order.id}
                quantity={order.quantity}
                rowSpan={rowSpan}
                totalUnits={totalUnits}
            />
        ));
    });

    return (
        <div className="table-responsive mt-4">
            <table className="table align-middle">
                <thead>
                    <tr>
                        <th scope="col" className="text-uppercase text-muted small">
                            Position
                        </th>
                        <th scope="col" className="text-uppercase text-muted small">
                            SKU
                        </th>
                        <th scope="col" className="text-uppercase text-muted small">
                            Product
                        </th>
                        <th scope="col" className="text-uppercase text-muted small">
                            Order
                        </th>
                        <th scope="col" className="text-uppercase text-muted small text-end">
                            Quantity
                        </th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
};
