import type {FulfillmentOrder} from '../entities/fulfillment-order';
import {useAuth, useFulfillmentOrders} from '../hooks';
import {Header} from '../ui/header';
import {Page} from '../ui/page';

const useData = function (): FulfillmentOrder[] | undefined {
    const {data: authData} = useAuth();
    const {data: fulfillmentOrders} = useFulfillmentOrders();

    if (authData === undefined || fulfillmentOrders === undefined) return undefined;
    return fulfillmentOrders.filter((item) => item.assigned_to.includes(authData!.auth_user.username));
};

const PickerWorker = function () {
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

export default PickerWorker;
