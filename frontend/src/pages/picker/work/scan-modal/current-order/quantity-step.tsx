import React from 'react';

export const QuantityStep: React.FC<{
    orderId: string;
    maxQuantity: number;
    initialQuantity: number;
    requiresSerialTracking: boolean;
    error: string | null;
    onSubmit: (quantity: number) => void;
}> = function ({orderId, maxQuantity, initialQuantity, requiresSerialTracking, error, onSubmit}) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [quantity, setQuantity] = React.useState<number>(initialQuantity);
    React.useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);
    React.useEffect(() => {
        inputRef.current?.select();
    }, []);

    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        const rawValue: string = e.target.value;
        const parsedValue: number = rawValue === '' ? 0 : Number(rawValue);
        const normalizedValue: number =
            Number.isNaN(parsedValue) || parsedValue < 0 ? 0 : Math.min(maxQuantity, parsedValue);
        setQuantity(normalizedValue);
    };

    const handleSubmit = function (e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit(quantity);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="number"
                    min={0}
                    max={maxQuantity}
                    step={1}
                    className="form-control form-control-lg text-center fs-1 fw-bold mx-auto"
                    style={{maxWidth: 180}}
                    value={quantity}
                    onChange={handleChange}
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
