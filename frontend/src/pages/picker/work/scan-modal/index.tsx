import React from 'react';

import type {FulfillmentOrderPosition} from '../../../../hooks/fulfillment-orders/types';
import {Orders} from './orders';
import {PositionSelector} from './position-selector';

const PositionBadge: React.FC<{children: React.ReactNode}> = function ({children}) {
    return (
        <span className="badge text-bg-secondary px-3 py-2 fs-6 text-center" style={{display: 'inline-block'}}>
            {children}
        </span>
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
                                    <div className="mb-3">
                                        <p className="mb-2">
                                            <PositionBadge>{currentPosition.position}</PositionBadge>
                                        </p>
                                        <div className="p-2">
                                            <Orders position={currentPosition} />
                                        </div>
                                    </div>
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
