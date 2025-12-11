import React from 'react';

import type {FulfillmentOrderPosition} from '../../../hooks/fulfillment-orders/types';

const PositionBadge: React.FC<{children: React.ReactNode}> = function ({children}) {
    return (
        <span className="badge text-bg-secondary px-3 py-2 fs-6 text-center" style={{display: 'inline-block'}}>
            {children}
        </span>
    );
};

const PositionButton: React.FC<{children: React.ReactNode; onClick: () => void}> = function ({children, onClick}) {
    return (
        <button type="button" className="badge text-bg-secondary px-3 py-2 fs-6 border-0" onClick={onClick}>
            {children}
        </button>
    );
};

const PositionSelector: React.FC<{
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

export const ScanModal: React.FC<{handleHide: () => void; scanValue: string; positions: FulfillmentOrderPosition[]}> =
    function ({handleHide, scanValue, positions}) {
        const [currentPosition, setCurrentPosition] = React.useState<FulfillmentOrderPosition | null>(null);
        const positionResults: FulfillmentOrderPosition[] = positions.filter(
            (value) => value.product.sku.trim().toLocaleLowerCase() === scanValue.trim().toLocaleLowerCase()
        );
        console.assert(positionResults.length > 0);
        React.useEffect(() => {
            if (positionResults.length === 1) setCurrentPosition(positionResults[0]);
        }, [positionResults]);

        return (
            <>
                <div className="modal fade show" style={{display: 'block'}} role="dialog" aria-modal="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title font-monospace">
                                    {'$>'} <strong>{scanValue}</strong>
                                </h5>
                            </div>
                            <div className="modal-body">
                                {currentPosition === null ? (
                                    <PositionSelector positions={positionResults} onClick={setCurrentPosition} />
                                ) : (
                                    <p className="mb-3">
                                        Current position: <PositionBadge>{currentPosition.position}</PositionBadge>
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleHide}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show" />
            </>
        );
    };
