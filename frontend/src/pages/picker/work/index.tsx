import {useAuth} from '../../../hooks/auth';
import {useFulfillmentOrders} from '../../../hooks/fulfillment-orders';
import type {FulfillmentOrder} from '../../../hooks/fulfillment-orders/types';
import {Header} from '../../../ui/header';
import {Page} from '../../../ui/page';

const useData = function (): FulfillmentOrder[] | undefined {
    const {data: authData} = useAuth();
    const {data: fulfillmentOrders} = useFulfillmentOrders();

    if (fulfillmentOrders === undefined) return undefined;
    return fulfillmentOrders.filter((item) => item.assigned_to.includes(authData!.auth_user.username));
};

const PickerWorkerPage = function () {
    const fulfillmentOrders: FulfillmentOrder[] | undefined = useData();

    console.log(fulfillmentOrders);

    return (
        <Page>
            <div className="pb-5 mb-5">
                <Header title="Picker Workbench" subtitle="This screen will guide operators through picking tasks." />
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
