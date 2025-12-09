import type {FulfillmentOrderPosition} from '../../../hooks/fulfillment-orders/types';

const TableRow: React.FC<{
    isFirst: boolean;
    position: FulfillmentOrderPosition;
    orderId: string;
    quantity: number;
    rowSpan: number;
    totalUnits: number;
}> = function ({isFirst, position, orderId, quantity, rowSpan, totalUnits}) {
    return (
        <tr>
            {isFirst ? (
                <>
                    <td rowSpan={rowSpan} className="align-top" style={{width: '200px'}}>
                        <div className="d-flex flex-column gap-1">
                            <span className="badge text-bg-secondary px-3 py-2 fs-6">{position.position}</span>
                            <span className="text-muted small">
                                {position.orders.length} orders · {totalUnits} units
                            </span>
                        </div>
                    </td>
                    <td rowSpan={rowSpan} className="fw-semibold font-monospace">
                        {position.product.sku}
                    </td>
                    <td rowSpan={rowSpan} className="text-muted">
                        {position.product.name}
                    </td>
                </>
            ) : null}
            <td>
                <span className="badge text-bg-light text-body-emphasis">{orderId}</span>
            </td>
            <td className="text-end fw-semibold">×{quantity}</td>
        </tr>
    );
};

export const PositionsTable: React.FC<{positions: FulfillmentOrderPosition[] | undefined}> = function ({positions}) {
    if (positions === undefined) return <div className="text-muted text-center py-4">Loading positions…</div>;
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
                            Qty
                        </th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
};
