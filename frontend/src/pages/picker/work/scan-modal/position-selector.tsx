import React from 'react';

import type {FulfillmentOrderPosition} from '../../../../hooks/fulfillment-orders/types';
import {ItemCards, type ItemCard} from './item-cards';

export const PositionSelector: React.FC<{
    positions: FulfillmentOrderPosition[];
    onClick: (v: FulfillmentOrderPosition) => void;
}> = function ({positions, onClick}) {
    const items: ItemCard[] = positions.map((result: FulfillmentOrderPosition) => {
        const handleClick = function () {
            onClick(result);
        };

        return {
            id: `${result.product.sku}-${result.position}`,
            title: 'Position',
            value: result.position,
            titleRight: 'Orders',
            valueRight: result.orders.length,
            onClick: handleClick
        };
    });

    return <ItemCards items={items} />;
};
