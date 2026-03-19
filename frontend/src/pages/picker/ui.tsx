import {useAuth} from '../../hooks/auth';
import {useFulfillmentOrders} from '../../hooks/fulfillment-orders';
import type {FulfillmentOrder} from '../../hooks/fulfillment-orders/types';
import {formatOrderDate} from '../../util';

export const AssignmentBadge: React.FC<{username: string; quantity?: number}> = function ({username, quantity}) {
    const {data: authData} = useAuth();

    const currentLogged = authData!.auth_user.username;
    const badgeClass =
        username === currentLogged
            ? 'bg-success-subtle text-success-emphasis border-success-subtle'
            : 'bg-light text-body-secondary border-secondary-subtle';
    const label = username === currentLogged ? 'ME' : username;

    return (
        <span className={`d-inline-flex align-items-center gap-1 rounded-pill border px-2 ${badgeClass}`}>
            <span className="fw-semibold">{label}</span>
            {quantity !== undefined && <span className="border-start ps-1">×{quantity}</span>}
        </span>
    );
};

export type FulfillmentActions = ReturnType<typeof useFulfillmentOrders>['actions'];

const Buttons: React.FC<{item: FulfillmentOrder; actions: FulfillmentActions}> = function ({item, actions}) {
    const {data: authData} = useAuth();

    const currentLogged = authData!.auth_user.username;
    const isAssignedToMe = item.assigned_to.includes(currentLogged);

    const handleAssign = function () {
        if (isAssignedToMe) actions.unassign(item.id);
        else actions.assign(item.id);
    };

    return (
        <button
            className={`btn mt-auto ${isAssignedToMe ? 'btn-outline-danger' : 'btn-outline-primary'}`}
            type="button"
            onClick={handleAssign}
        >
            {isAssignedToMe ? 'Unassign me' : 'Assign me'}
        </button>
    );
};

export const FulfillmentCard: React.FC<{item: FulfillmentOrder; actions?: FulfillmentActions}> = function ({
    item,
    actions
}) {
    const assigned_to = item.assigned_to.map((username) => <AssignmentBadge key={username} username={username} />);

    return (
        <div className="col" key={item.id}>
            <div className="card h-100">
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1">{item.id}</h5>
                    <p className="card-text text-muted flex-grow-1">
                        <time dateTime={item.created_at.toISOString()}>{formatOrderDate(item.created_at)}</time>
                    </p>
                    <div className="mb-3">
                        <div className="d-flex flex-wrap gap-2 mt-1">{assigned_to}</div>
                    </div>
                    {actions !== undefined && <Buttons item={item} actions={actions} />}
                </div>
            </div>
        </div>
    );
};

export const CardsGrid: React.FC<{items: FulfillmentOrder[]; actions?: FulfillmentActions}> = function ({
    items,
    actions
}) {
    if (items.length === 0) return null;
    const cards = items.map((item) => <FulfillmentCard key={item.id} item={item} actions={actions} />);
    return <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">{cards}</div>;
};
