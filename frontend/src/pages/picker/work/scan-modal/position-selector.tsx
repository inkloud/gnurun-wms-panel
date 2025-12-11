import React from 'react';

import type {FulfillmentOrderPosition} from '../../../../hooks/fulfillment-orders/types';

const PositionButton: React.FC<{children: React.ReactNode; onClick: () => void}> = function ({children, onClick}) {
    return (
        <button type="button" className="badge text-bg-secondary px-3 py-2 fs-6 border-0" onClick={onClick}>
            {children}
        </button>
    );
};

export const PositionSelector: React.FC<{
    positions: FulfillmentOrderPosition[];
    onClick: (v: FulfillmentOrderPosition) => void;
}> = function ({positions, onClick}) {
    const buttons = positions.map((result: FulfillmentOrderPosition) => {
        const handleClick = function () {
            onClick(result);
        };

        return (
            <PositionButton key={`${result.product.id}-${result.position}`} onClick={handleClick}>
                {result.position}
            </PositionButton>
        );
    });
    return (
        <>
            <p className="text-muted small mb-2">Select your current position:</p>
            <div className="d-flex flex-wrap gap-2">{buttons}</div>
        </>
    );
};
