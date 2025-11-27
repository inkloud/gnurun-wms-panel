import React from 'react';

import {useAuth} from '../../../hooks/auth';
import {useFulfillmentOrders} from '../../../hooks/fulfillment-orders';
import type {FulfillmentOrder} from '../../../hooks/fulfillment-orders/types';
import {formatOrderDate} from '../../../util';

type FulfillmentActions = ReturnType<typeof useFulfillmentOrders>['actions'];

const UserBadge: React.FC<{username: string}> = function ({username}) {
    const {data: authData} = useAuth();

    const currentLogged = authData!.auth_user.username;
    const badgeClass = username === currentLogged ? 'badge bg-success' : 'badge bg-secondary';
    const label = username === currentLogged ? 'ME' : username;
    return (
        <span key={username} className={badgeClass}>
            {label}
        </span>
    );
};

export const FulfillmentCard: React.FC<{item: FulfillmentOrder; actions: FulfillmentActions}> = function ({
    item,
    actions
}) {
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
                        className={`btn mt-auto ${isAssignedToMe ? 'btn-outline-danger' : 'btn-outline-primary'}`}
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
