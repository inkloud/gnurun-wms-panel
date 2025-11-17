import React from 'react';

import type {FulfillmentOrder} from '../../entities/fulfillment-order';
import {useAuth, useFulfillmentOrders} from '../../hooks';
import {Header} from '../../ui/header';
import {Page} from '../../ui/page';
import {OrderCards} from './orders';

const ErrorMessage: React.FC<{msg: string}> = function ({msg}) {
    return (
        <div className="alert alert-danger" role="alert">
            {msg}
        </div>
    );
};

const BottomNavbar: React.FC<{children: React.ReactNode}> = function ({children}) {
    return (
        <nav className="navbar navbar-light bg-white border-top shadow-sm fixed-bottom" aria-label="Work toolbar">
            <div className="container py-2">{children}</div>
        </nav>
    );
};

const DoWorkButton: React.FC<{items: FulfillmentOrder[] | undefined; disabled: boolean}> = function ({
    items,
    disabled
}) {
    const {data: authData} = useAuth();

    const mineItems =
        items === undefined || authData === undefined
            ? undefined
            : items.filter((order) => order.assigned_to.includes(authData!.auth_user.username));

    const isDisabled = disabled || mineItems === undefined || mineItems.length === 0;
    const classes = `btn btn-primary w-100 py-2${isDisabled ? ' disabled' : ''}`;
    return (
        <a className={classes} href="#/picker/work" role="button" aria-disabled={isDisabled}>
            Work
        </a>
    );
};

const AuthedPicker = function () {
    const {data: authData} = useAuth();
    const {data: fulfillmentOrders, error, actions} = useFulfillmentOrders();

    const isPending = fulfillmentOrders === undefined || authData === undefined;
    const isError = error !== undefined;
    const isReady = !isError && !isPending;

    return (
        <Page>
            <div className="pb-5 mb-5">
                <Header title="Picker" subtitle="Assign fulfillment orders to yourself before you start picking." />
                {isError && <ErrorMessage msg="Unable to load fulfillment orders. Please refresh and try again." />}
                {!isError && isPending && (
                    <div className="text-muted text-center py-5">Loading fulfillment orders…</div>
                )}
                {isReady && (
                    <OrderCards
                        items={fulfillmentOrders}
                        actions={actions}
                        currentUser={authData!.auth_user.username}
                    />
                )}
            </div>
            <BottomNavbar>
                <DoWorkButton items={fulfillmentOrders} disabled={!isReady} />
            </BottomNavbar>
        </Page>
    );
};

const Picker = function () {
    const {data: authData} = useAuth();

    if (authData === undefined) return null;
    return <AuthedPicker />;
};

export default Picker;
