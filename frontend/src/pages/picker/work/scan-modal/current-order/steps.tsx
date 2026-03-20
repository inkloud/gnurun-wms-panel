import React from 'react';

export const QuantityStep: React.FC<{
    orderId: string;
    maxQuantity: number;
    quantity: number;
    quantityInputRef: React.RefObject<HTMLInputElement | null>;
    requiresSerialTracking: boolean;
    error: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}> = function ({orderId, maxQuantity, quantity, quantityInputRef, requiresSerialTracking, error, onChange, onSubmit}) {
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    ref={quantityInputRef}
                    type="number"
                    min={0}
                    max={maxQuantity}
                    step={1}
                    className="form-control form-control-lg text-center fs-1 fw-bold mx-auto"
                    style={{maxWidth: 180}}
                    value={quantity}
                    onChange={onChange}
                    onFocus={(e) => e.currentTarget.select()}
                    autoFocus
                />
                {requiresSerialTracking ? (
                    <p className="text-muted small text-center mt-3 mb-0">
                        Scan {quantity} serial number{quantity === 1 ? '' : 's'} in the next step.
                    </p>
                ) : null}
                {error !== null ? <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div> : null}
                <button
                    type="submit"
                    className="btn btn-success btn-lg mt-3 d-flex justify-content-center align-items-center gap-2 mx-auto"
                    style={{maxWidth: 180}}
                >
                    {requiresSerialTracking ? 'Continue' : orderId}
                </button>
            </form>
        </div>
    );
};

export const SerialScanStep: React.FC<{
    quantity: number;
    serialInput: string;
    serialNumbers: string[];
    serialInputRef: React.RefObject<HTMLInputElement | null>;
    error: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
    onBack: () => void;
    onConfirm: () => void;
}> = function ({quantity, serialInput, serialNumbers, serialInputRef, error, onChange, onSubmit, onBack, onConfirm}) {
    return (
        <div className="d-flex flex-column gap-3">
            <form onSubmit={onSubmit}>
                <input
                    ref={serialInputRef}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Scan serial number"
                    autoComplete="off"
                    value={serialInput}
                    onChange={onChange}
                    autoFocus
                />
            </form>
            {error !== null ? <div className="alert alert-danger py-2 mb-0">{error}</div> : null}
            <div className="d-flex flex-wrap gap-2">
                {serialNumbers.map((serialNumber) => (
                    <span key={serialNumber} className="badge text-bg-light border">
                        {serialNumber}
                    </span>
                ))}
            </div>
            <div className="d-flex justify-content-between gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={onBack}>
                    Back
                </button>
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={onConfirm}
                    disabled={serialNumbers.length !== quantity}
                >
                    Confirm pick
                </button>
            </div>
        </div>
    );
};
