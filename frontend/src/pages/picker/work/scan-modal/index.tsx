import React from 'react';

import type {FulfillmentOrderPosition, OrderType} from '../../../../hooks/fulfillment-orders/types';
import {Orders} from './orders';
import {PositionSelector} from './position-selector';
import {TitleBreadcrumb} from './title-breadcrumb';

export const ScanModal: React.FC<{handleHide: () => void; scanValue: string; positions: FulfillmentOrderPosition[]}> =
    function ({handleHide, scanValue, positions}) {
        const [currentPosition, setCurrentPosition] = React.useState<FulfillmentOrderPosition | null>(null);
        const [currentOrder, setCurrentOrder] = React.useState<OrderType | null>(null);
        const positionResults: FulfillmentOrderPosition[] = React.useMemo(
            () =>
                positions.filter(
                    (value) => value.product.sku.trim().toLocaleLowerCase() === scanValue.trim().toLocaleLowerCase()
                ),
            [positions, scanValue]
        );
        console.assert(positionResults.length > 0);
        React.useEffect(() => {
            if (positionResults.length === 1) {
                setCurrentPosition(positionResults[0]);
                setCurrentOrder(null);
            }
        }, [positionResults]);

        const handleBreadcrumbBackToScan = function () {
            setCurrentPosition(null);
            setCurrentOrder(null);
        };

        const handleBreadcrumbBackToOrders = function () {
            setCurrentOrder(null);
        };

        return (
            <>
                <div className="modal fade show" style={{display: 'block'}} role="dialog" aria-modal="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <TitleBreadcrumb
                                    scanValue={scanValue}
                                    currentPosition={currentPosition}
                                    currentOrder={currentOrder}
                                    onBackToScan={handleBreadcrumbBackToScan}
                                    onBackToOrders={handleBreadcrumbBackToOrders}
                                />
                            </div>
                            <div className="modal-body">
                                {currentPosition === null ? (
                                    <PositionSelector
                                        positions={positionResults}
                                        onClick={(position) => {
                                            setCurrentPosition(position);
                                            setCurrentOrder(null);
                                        }}
                                    />
                                ) : (
                                    <div className="mb-3">
                                        <div className="p-2">
                                            <Orders
                                                position={currentPosition}
                                                currentOrder={currentOrder}
                                                onSelectOrder={setCurrentOrder}
                                            />
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
