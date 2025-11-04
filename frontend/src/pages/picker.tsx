import {useAuth, useFulfillmentOrders} from '../hooks';
import {Page} from '../ui/page';

const OrderCards = function () {};

const Picker = function () {
    const {data: authData} = useAuth();
    const token = authData!.access_token;
    const {data: fulfillmentOrders, error} = useFulfillmentOrders(token);

    const isPending = fulfillmentOrders === undefined;
    const hasOrders = (fulfillmentOrders?.length ?? 0) > 0;

    const renderOrders = function () {
        if (!fulfillmentOrders || !hasOrders) {
            return <div className="text-muted text-center py-5">No fulfillment orders are waiting for assignment.</div>;
        }

        return (
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                {fulfillmentOrders.map((order) => {
                    const dateValue = new Date(order.date);
                    const formattedDate = dateValue.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    return (
                        <div className="col" key={order.id}>
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title mb-1">{order.id}</h5>
                                    <p className="card-text text-muted flex-grow-1">
                                        <span className="d-block fw-semibold">Scheduled for</span>
                                        <time dateTime={order.date}>{formattedDate}</time>
                                    </p>
                                    <button className="btn btn-primary mt-2" type="button">
                                        Assign to me
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Page>
            <header className="mb-4">
                <h1 className="h2 mb-1 text-dark">Picker</h1>
                <p className="text-muted mb-0">Select and coordinate resources for upcoming deployments.</p>
            </header>
            {error && (
                <div className="alert alert-danger" role="alert">
                    Unable to load fulfillment orders. Please refresh and try again.
                </div>
            )}
            {!error && isPending && <div className="text-muted text-center py-5">Loading fulfillment orders…</div>}
            {!error && !isPending && renderOrders()}
        </Page>
    );
};

export default Picker;
