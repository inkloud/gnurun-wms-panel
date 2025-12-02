import type {FulfillmentOrderPosition, FulfillmentOrderProduct} from '../../../hooks/fulfillment-orders/types';

const TableRow: React.FC<{
    isFirst: boolean;
    position: FulfillmentOrderPosition;
    product: FulfillmentOrderProduct;
    totalUnits: number;
}> = function ({isFirst, position, product, totalUnits}) {
    return (
        <tr>
            {isFirst ? (
                <td rowSpan={position.products.length} className="align-top" style={{width: '200px'}}>
                    <div className="d-flex flex-column gap-1">
                        <span className="badge text-bg-secondary px-3 py-2 fs-6">{position.position}</span>
                        <span className="text-muted small">
                            {position.products.length} products · {totalUnits} units
                        </span>
                    </div>
                </td>
            ) : null}
            <td className="fw-semibold font-monospace">{product.sku}</td>
            <td className="text-muted">{product.name}</td>
            <td>
                <span className="badge text-bg-light text-body-emphasis">{product.fulfillment_order_id}</span>
            </td>
            <td className="text-end fw-semibold">×{product.quantity}</td>
        </tr>
    );
};

export const PositionsTable: React.FC<{positions: FulfillmentOrderPosition[] | undefined}> = function ({positions}) {
    if (positions === undefined) return <div className="text-muted text-center py-4">Loading positions…</div>;
    if (positions.length === 0)
        return <div className="text-muted text-center py-4">No positions assigned to your orders yet.</div>;

    const rows = positions.flatMap((position) => {
        const totalUnits = position.products.reduce((sum, product) => sum + product.quantity, 0);
        return position.products.map((product, idx) => (
            <TableRow
                key={`${position.position}-${product.fulfillment_order_id}-${product.sku}`}
                isFirst={idx === 0}
                position={position}
                product={product}
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
