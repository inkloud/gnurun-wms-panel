import {useAuth} from '../../../hooks/auth';
import {
    useFulfillmentOrderPositions,
    useFulfillmentOrderProducts,
    useFulfillmentOrders
} from '../../../hooks/fulfillment-orders';
import type {FulfillmentOrder} from '../../../hooks/fulfillment-orders/types';
import {Header} from '../../../ui/header';
import {Page} from '../../../ui/page';
import {CardsGrid} from '../ui';
import {BottomNavbar} from './bottom-navbar';
import {PositionsTable} from './positions-table';

const useData = function (): FulfillmentOrder[] | undefined {
    const {data: authData} = useAuth();
    const {data: fulfillmentOrders} = useFulfillmentOrders();

    if (fulfillmentOrders === undefined) return undefined;
    return fulfillmentOrders.filter((item) => item.assigned_to.includes(authData!.auth_user.username));
};

const PickerWorkerPage = function () {
    const fulfillmentOrders: FulfillmentOrder[] | undefined = useData();
    const products = useFulfillmentOrderProducts(
        new Set(fulfillmentOrders === undefined ? [] : fulfillmentOrders.map((item) => item.id))
    );
    const positions = useFulfillmentOrderPositions(
        new Set(fulfillmentOrders === undefined ? [] : fulfillmentOrders.map((item) => item.id))
    );

    if (fulfillmentOrders === undefined) return null;
    return (
        <Page>
            <div className="pb-5 mb-5">
                <Header title="Picker Workbench" subtitle="This screen will guide operators through picking tasks." />
                <CardsGrid items={fulfillmentOrders} />
                <PositionsTable positions={positions} />
            </div>
            <BottomNavbar orders={fulfillmentOrders} products={products} />
        </Page>
    );
};

const PickerWorker = function () {
    const {data: authData} = useAuth();

    if (authData === undefined) return null;
    return <PickerWorkerPage />;
};

export default PickerWorker;
