import type {FulfillmentOrderLinePick, FulfillmentOrderPosition} from '../../../hooks/fulfillment-orders/types';

const TableRow: React.FC<{
    isFirst: boolean;
    position: FulfillmentOrderPosition;
    orderId: string;
    quantity: number;
    rowSpan: number;
    totalUnits: number;
    linePicks: FulfillmentOrderLinePick[];
}> = function ({isFirst, position, orderId, quantity, rowSpan, totalUnits, linePicks}) {
    const picks = linePicks.map((lp) => (
        <span key={lp.operator_id} className="badge text-bg-secondary">
            {lp.operator_id} - {lp.quantity_picked}
        </span>
    ));
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
                <p>{picks}</p>
            </td>
            <td className="text-end fw-semibold">×{quantity}</td>
        </tr>
    );
};

export const PositionsTable: React.FC<{positions: FulfillmentOrderPosition[]; linePicks: FulfillmentOrderLinePick[]}> =
    function ({positions, linePicks}) {
        if (positions.length === 0)
            return <div className="text-muted text-center py-4">No positions assigned to your orders yet.</div>;

        const rows = positions.flatMap((position) => {
            const orders = position.orders.length > 0 ? position.orders : [{id: '—', quantity: 0}];
            const totalUnits = position.orders.reduce((sum, order) => sum + order.quantity, 0);
            const rowSpan = orders.length;
            const linePicksByPosition: FulfillmentOrderLinePick[] = linePicks.filter(
                (lp) => lp.position_code === position.position
            );
            return orders.map((order, idx) => (
                <TableRow
                    key={`${position.position}-${order.id}-${idx}`}
                    isFirst={idx === 0}
                    position={position}
                    orderId={order.id}
                    quantity={order.quantity}
                    rowSpan={rowSpan}
                    totalUnits={totalUnits}
                    linePicks={linePicksByPosition.filter((lp) => lp.fulfillment_order_id === order.id)}
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
