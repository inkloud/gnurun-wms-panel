import {useState} from 'react';
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

const ScanModal: React.FC<{handleHide: () => void; scanValue: string}> = function ({handleHide, scanValue}) {
    return (
        <>
            <div className="modal fade show" style={{display: 'block'}} role="dialog" aria-modal="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Scan captured</h5>
                        </div>
                        <div className="modal-body">
                            <p className="mb-0">{scanValue}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleHide}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" />
        </>
    );
};

const PickerWorkerPage = function () {
    const fulfillmentOrders: FulfillmentOrder[] | undefined = useData();
    const products = useFulfillmentOrderProducts(
        new Set(fulfillmentOrders === undefined ? [] : fulfillmentOrders.map((item) => item.id))
    );
    const positions = useFulfillmentOrderPositions(
        new Set(fulfillmentOrders === undefined ? [] : fulfillmentOrders.map((item) => item.id))
    );
    const [scanValue, setScanValue] = useState<string>('');
    const [showModal, setShowModal] = useState(false);

    const handleScan = function (value: string) {
        setScanValue(value);
        setShowModal(true);
    };

    if (fulfillmentOrders === undefined) return null;
    return (
        <Page>
            <div className="pb-5 mb-5">
                <Header title="Picker Workbench" subtitle="This screen will guide operators through picking tasks." />
                <CardsGrid items={fulfillmentOrders} />
                <PositionsTable positions={positions} />
            </div>
            <BottomNavbar orders={fulfillmentOrders} products={products} onScan={handleScan} />
            {showModal ? <ScanModal handleHide={() => setShowModal(false)} scanValue={scanValue} /> : null}
        </Page>
    );
};

const PickerWorker = function () {
    const {data: authData} = useAuth();

    if (authData === undefined) return null;
    return <PickerWorkerPage />;
};

export default PickerWorker;
