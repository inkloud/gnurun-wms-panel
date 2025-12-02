import type {FulfillmentOrderProduct} from '../../../hooks/fulfillment-orders/types';

const ProductTableRow: React.FC<{item: FulfillmentOrderProduct}> = function ({item}) {
    return (
        <tr>
            <td className="fw-semibold">{item.fulfillment_order_id}</td>
            <td className="fw-semibold">{item.sku}</td>
            <td className="fst-italic">{item.name}</td>
            <td className="text-end fw-semibold">{item.quantity}</td>
            <td className="text-end">
                <span className="badge text-bg-light font-monospace">{item.position}</span>
            </td>
        </tr>
    );
};

export const ProductsTable: React.FC<{products: FulfillmentOrderProduct[] | undefined}> = function ({products}) {
    if (products === undefined) return <div className="text-muted text-center py-4">Loading products…</div>;
    if (products.length === 0)
        return <div className="text-muted text-center py-4">No products to pick for your orders yet.</div>;

    const tableRows = products.map((item) => (
        <ProductTableRow key={`${item.sku}-${item.fulfillment_order_id}-${item.position}`} item={item} />
    ));
    return (
        <div className="table-responsive mt-4">
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th scope="col" className="text-uppercase text-muted small">
                            Order
                        </th>
                        <th scope="col" className="text-uppercase text-muted small">
                            SKU
                        </th>
                        <th scope="col" className="text-uppercase text-muted small">
                            Product
                        </th>
                        <th scope="col" className="text-uppercase text-muted small text-end">
                            Qty
                        </th>
                        <th scope="col" className="text-uppercase text-muted small text-end">
                            Position
                        </th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </div>
    );
};
