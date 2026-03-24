import React from 'react';

export const SerialScanStep: React.FC<{
    quantity: number;
    serialNumbers: string[];
    error: string | null;
    onSubmit: (serialNumber: string) => void;
    onBack: () => void;
    onConfirm: () => void;
}> = function ({quantity, serialNumbers, error, onSubmit, onBack, onConfirm}) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [serialInput, setSerialInput] = React.useState<string>('');
    React.useEffect(() => {
        inputRef.current?.focus();
    }, []);
    React.useEffect(() => {
        setSerialInput('');
        inputRef.current?.focus();
    }, [serialNumbers.length]);

    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        setSerialInput(e.target.value);
    };

    const handleSubmit = function (e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const normalized = serialInput.trim();
        setSerialInput(normalized);
        onSubmit(normalized);
    };

    return (
        <div className="d-flex flex-column gap-3">
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Scan serial number"
                    autoComplete="off"
                    value={serialInput}
                    onChange={handleChange}
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
