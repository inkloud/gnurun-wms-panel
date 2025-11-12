import React from 'react';

import type {FulfillmentOrder} from '../entities/fulfillment-order';
import {useAuth, useFulfillmentOrders} from '../hooks';
import {Page} from '../ui/page';
import {formatOrderDate} from '../util';

type FulfillmentActions = ReturnType<typeof useFulfillmentOrders>['actions'];

const ErrorMessage: React.FC<{msg: string}> = function ({msg}) {
    return (
        <div className="alert alert-danger" role="alert">
            {msg}
        </div>
    );
};

const UserBadge: React.FC<{username: string}> = function ({username}) {
    const {data: authData} = useAuth();

    const currentLogged = authData!.auth_user.username;
    const badgeClass = username === currentLogged ? 'badge bg-success' : 'badge bg-secondary';
    return (
        <span key={username} className={badgeClass}>
            {username}
        </span>
    );
};

const FulfillmentCard: React.FC<{item: FulfillmentOrder; actions: FulfillmentActions}> = function ({item, actions}) {
    const {data: authData} = useAuth();

    const currentLogged = authData!.auth_user.username;
    const assigned_to = item.assigned_to.map((username) => <UserBadge key={username} username={username} />);
    const isAssignedToMe = item.assigned_to.includes(currentLogged);

    const handleAssign = function () {
        if (isAssignedToMe) actions.unassign(item.id);
        else actions.assign(item.id);
    };

    return (
        <div className="col" key={item.id}>
            <div className="card h-100">
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1">{item.id}</h5>
                    <p className="card-text text-muted flex-grow-1">
                        <time dateTime={item.date.toISOString()}>{formatOrderDate(item.date)}</time>
                    </p>
                    <div className="mb-3">
                        <div className="d-flex flex-wrap gap-2 mt-1">{assigned_to}</div>
                    </div>
                    <button
                        className={`btn mt-auto ${isAssignedToMe ? 'btn-danger' : 'btn-primary'}`}
                        type="button"
                        onClick={handleAssign}
                    >
                        {isAssignedToMe ? 'Unassign me' : 'Assign me'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CardsGrid: React.FC<{items: FulfillmentOrder[]; actions: FulfillmentActions}> = function ({items, actions}) {
    if (items.length === 0) return null;
    const cards = items.map((item) => <FulfillmentCard key={item.id} item={item} actions={actions} />);
    return <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">{cards}</div>;
};

const OrderCards: React.FC<{items: FulfillmentOrder[]; actions: FulfillmentActions; currentUser: string}> = function ({
    items,
    actions,
    currentUser
}) {
    if (items.length === 0)
        return <div className="text-muted text-center py-5">No fulfillment orders are waiting for assignment.</div>;

    const mine = items.filter((item) => item.assigned_to.includes(currentUser));
    const unassigned = items.filter((item) => item.assigned_to.length === 0);
    const assignedToOthers = items.filter(
        (item) => item.assigned_to.length > 0 && !item.assigned_to.includes(currentUser)
    );

    const sections = [
        {key: 'mine', items: mine},
        {key: 'unassigned', items: unassigned},
        {key: 'others', items: assignedToOthers}
    ].filter(({items: sectionItems}) => sectionItems.length > 0);

    return (
        <>
            {sections.map(({key, items: sectionItems}, index) => (
                <React.Fragment key={key}>
                    {index > 0 && <hr className="my-4" />}
                    <CardsGrid items={sectionItems} actions={actions} />
                </React.Fragment>
            ))}
        </>
    );
};

const AuthedPicker = function () {
    const {data: authData} = useAuth();
    const {data: fulfillmentOrders, error, actions} = useFulfillmentOrders();

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
            {!isError && !isPending && authData !== undefined && (
                <OrderCards items={fulfillmentOrders} actions={actions} currentUser={authData!.auth_user.username} />
            )}
        </Page>
    );
};

const Picker = function () {
    const {data: authData} = useAuth();

    if (authData === undefined) return null;
    return <AuthedPicker />;
};

export default Picker;
