import React from 'react';

import type {FulfillmentOrder} from '../../../hooks/fulfillment-orders/types';
import {CardsGrid, type FulfillmentActions} from '../ui';

type Section = {key: 'mine' | 'unassigned' | 'others'; title: string; items: FulfillmentOrder[]};

export const OrderCards: React.FC<{items: FulfillmentOrder[]; actions: FulfillmentActions; currentUser: string}> =
    function ({items, actions, currentUser}) {
        if (items.length === 0)
            return <div className="text-muted text-center py-5">No fulfillment orders are waiting for assignment.</div>;

        const mine = items.filter((item) => item.assigned_to.includes(currentUser));
        const unassigned = items.filter((item) => item.assigned_to.length === 0);
        const assignedToOthers = items.filter(
            (item) => item.assigned_to.length > 0 && !item.assigned_to.includes(currentUser)
        );

        const allSections: Section[] = [
            {key: 'mine', title: 'Assigned to me', items: mine},
            {key: 'unassigned', title: 'Unassigned', items: unassigned},
            {key: 'others', title: 'Assigned to others', items: assignedToOthers}
        ];
        const sections: Section[] = allSections.filter(({items: sectionItems}) => sectionItems.length > 0);

        return (
            <>
                {sections.map(({key, title, items: sectionItems}) => (
                    <React.Fragment key={key}>
                        <h2 className="h5 text-uppercase text-muted fw-semibold m-3">{title}</h2>
                        <CardsGrid items={sectionItems} actions={actions} />
                    </React.Fragment>
                ))}
            </>
        );
    };
