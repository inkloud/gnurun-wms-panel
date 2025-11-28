import {useAuth} from '../../../hooks/auth';
import {useFulfillmentOrderProducts, useFulfillmentOrders} from '../../../hooks/fulfillment-orders';
import type {FulfillmentOrder, FulfillmentOrderProduct} from '../../../hooks/fulfillment-orders/types';
import {Header} from '../../../ui/header';
import {Page} from '../../../ui/page';
import {CardsGrid} from '../ui';

const useData = function (): FulfillmentOrder[] | undefined {
    const {data: authData} = useAuth();
    const {data: fulfillmentOrders} = useFulfillmentOrders();

    if (fulfillmentOrders === undefined) return undefined;
    return fulfillmentOrders.filter((item) => item.assigned_to.includes(authData!.auth_user.username));
};

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

const ProductsTable: React.FC<{items: FulfillmentOrder[]}> = function ({items}) {
    const data = useFulfillmentOrderProducts(new Set(items.map((item) => item.id)));

    if (data === undefined) return <div className="text-muted text-center py-4">Loading products…</div>;
    if (data.length === 0)
        return <div className="text-muted text-center py-4">No products to pick for your orders yet.</div>;

    const tableRows = data.map((item) => (
        <ProductTableRow key={`${item.sku}-${item.fulfillment_order_id}`} item={item} />
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

const PickerWorkerPage = function () {
    const fulfillmentOrders: FulfillmentOrder[] | undefined = useData();

    if (fulfillmentOrders === undefined) return null;
    return (
        <Page>
            <div className="pb-5 mb-5">
                <Header title="Picker Workbench" subtitle="This screen will guide operators through picking tasks." />
                <CardsGrid items={fulfillmentOrders} />
                <ProductsTable items={fulfillmentOrders} />
            </div>
        </Page>
    );
};

const PickerWorker = function () {
    const {data: authData} = useAuth();

    if (authData === undefined) return null;
    return <PickerWorkerPage />;
};

export default PickerWorker;
