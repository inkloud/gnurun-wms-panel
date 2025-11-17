import React from 'react';

import {useAuth, useFulfillmentOrders} from '../../hooks';
import {Page} from '../../ui/page';
import {OrderCards} from './orders';

const ErrorMessage: React.FC<{msg: string}> = function ({msg}) {
    return (
        <div className="alert alert-danger" role="alert">
            {msg}
        </div>
    );
};

const AuthedPicker = function () {
    const {data: authData} = useAuth();
    const {data: fulfillmentOrders, error, actions} = useFulfillmentOrders();

    const isPending = fulfillmentOrders === undefined;
    const isError = error !== undefined;

    return (
        <Page>
            <div className="pb-5 mb-5">
                <header className="mb-4">
                    <h1 className="h2 mb-1 text-dark">Picker</h1>
                    <p className="text-muted mb-0">Assign fulfillment orders to yourself before you start picking.</p>
                </header>
                {isError && <ErrorMessage msg="Unable to load fulfillment orders. Please refresh and try again." />}
                {!isError && isPending && (
                    <div className="text-muted text-center py-5">Loading fulfillment orders…</div>
                )}
                {!isError && !isPending && authData !== undefined && (
                    <OrderCards
                        items={fulfillmentOrders}
                        actions={actions}
                        currentUser={authData!.auth_user.username}
                    />
                )}
            </div>
            <nav className="navbar navbar-light bg-white border-top shadow-sm fixed-bottom" aria-label="Work toolbar">
                <div className="container py-2">
                    <button type="button" className="btn btn-primary w-100 py-2">
                        Work
                    </button>
                </div>
            </nav>
        </Page>
    );
};

const Picker = function () {
    const {data: authData} = useAuth();

    if (authData === undefined) return null;
    return <AuthedPicker />;
};

export default Picker;
