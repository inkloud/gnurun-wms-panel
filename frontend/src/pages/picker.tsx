import type {FulfillmentOrder} from '../entities/fulfillment-order';
import {useAuth, useFulfillmentOrders} from '../hooks';
import {Page} from '../ui/page';

const ErrorMessage: React.FC<{msg: string}> = function ({msg}) {
    return (
        <div className="alert alert-danger" role="alert">
            {msg}
        </div>
    );
};

const FulfillmentCard: React.FC<{item: FulfillmentOrder}> = function ({item}) {
    const dateValue = new Date(item.date);
    const formattedDate = dateValue.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="col" key={item.id}>
            <div className="card h-100">
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1">{item.id}</h5>
                    <p className="card-text text-muted flex-grow-1">
                        <span className="d-block fw-semibold">Scheduled for</span>
                        <time dateTime={item.date}>{formattedDate}</time>
                    </p>
                    <button className="btn btn-primary mt-2" type="button">
                        Assign to me
                    </button>
                </div>
            </div>
        </div>
    );
};

const OrderCards: React.FC<{items: FulfillmentOrder[]}> = function ({items}) {
    if (items.length === 0)
        return <div className="text-muted text-center py-5">No fulfillment orders are waiting for assignment.</div>;

    const cards = items.map((item) => <FulfillmentCard key={item.id} item={item} />);
    return <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">{cards}</div>;
};

const AuthedPicker: React.FC<{token: string}> = function ({token}) {
    const {data: fulfillmentOrders, error} = useFulfillmentOrders(token);

    const isPending = fulfillmentOrders === undefined;
    const isError = error !== undefined;
    return (
        <Page>
            <header className="mb-4">
                <h1 className="h2 mb-1 text-dark">Picker</h1>
                <p className="text-muted mb-0">Assign fulfillment orders to yourself before you start picking.</p>
            </header>
            {isError && <ErrorMessage msg="Unable to load fulfillment orders. Please refresh and try again." />}
            {!isError && isPending && <div className="text-muted text-center py-5">Loading fulfillment orders…</div>}
            {!isError && !isPending && <OrderCards items={fulfillmentOrders} />}
        </Page>
    );
};

const Picker = function () {
    const {data: authData} = useAuth();

    if (authData === undefined) return null;
    return <AuthedPicker token={authData!.access_token} />;
};

export default Picker;
