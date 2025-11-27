import React from 'react';

import type {FulfillmentOrder} from '../../../hooks/fulfillment-orders/types';
import {CardsGrid, type FulfillmentActions} from '../ui';

export const OrderCards: React.FC<{items: FulfillmentOrder[]; actions: FulfillmentActions; currentUser: string}> =
    function ({items, actions, currentUser}) {
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
