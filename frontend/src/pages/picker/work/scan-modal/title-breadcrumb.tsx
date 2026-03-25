import type {FulfillmentOrderPosition, OrderType} from '../../../../hooks/fulfillment-orders/types';

export const TitleBreadcrumb: React.FC<{
    scanValue: string;
    currentPosition: FulfillmentOrderPosition | null;
    currentOrder: OrderType | null;
    onBackToScan: () => void;
    onBackToOrders: () => void;
}> = function ({scanValue, currentPosition, currentOrder, onBackToScan, onBackToOrders}) {
    return (
        <nav className="modal-title" aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 font-monospace">
                {currentPosition === null ? (
                    <li className="breadcrumb-item active" aria-current="page">
                        {scanValue}
                    </li>
                ) : (
                    <li className="breadcrumb-item">
                        <button
                            type="button"
                            className="btn btn-link p-0 border-0 text-decoration-none align-baseline"
                            onClick={onBackToScan}
                        >
                            {scanValue}
                        </button>
                    </li>
                )}
                {currentPosition !== null && currentOrder === null ? (
                    <li className="breadcrumb-item active" aria-current="page">
                        {currentPosition.position}
                    </li>
                ) : null}
                {currentPosition !== null && currentOrder !== null ? (
                    <li className="breadcrumb-item">
                        <button
                            type="button"
                            className="btn btn-link p-0 border-0 text-decoration-none align-baseline"
                            onClick={onBackToOrders}
                        >
                            {currentPosition.position}
                        </button>
                    </li>
                ) : null}
                {currentOrder !== null ? (
                    <li className="breadcrumb-item active" aria-current="page">
                        {currentOrder.id}
                    </li>
                ) : null}
            </ol>
        </nav>
    );
};
