import React from 'react';

import type {FulfillmentOrder, FulfillmentOrderLine} from '../../../hooks/fulfillment-orders/types';

export const BottomNavbar: React.FC<{
    orders: FulfillmentOrder[];
    lines: FulfillmentOrderLine[] | undefined;
    onScan: (v: string) => void;
}> = function ({orders, lines, onScan}) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [scanValue, setScanValue] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);
    React.useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const isLoading = lines === undefined;
    const totalQty = lines?.reduce((sum, item) => sum + item.quantity_required, 0) ?? 0;

    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        setScanValue(e.target.value);
    };

    const handleFocus = function (focus: boolean) {
        return () => setIsFocused(focus);
    };

    const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (scanValue.trim().length === 0) return;

        onScan(scanValue);

        setScanValue('');
        inputRef.current?.focus();
    };

    return (
        <nav className="navbar navbar-light bg-white border-top shadow-sm fixed-bottom" aria-label="Picker toolbar">
            <div className="container py-2">
                <div className="d-flex flex-wrap gap-3 align-items-center">
                    <div className="d-flex flex-wrap gap-3 align-items-center">
                        <span className="badge text-bg-light text-dark">
                            Orders assigned: <span className="fw-semibold">{orders.length}</span>
                        </span>
                        <span className="badge text-bg-light text-dark">
                            Product lines: <span className="fw-semibold">{isLoading ? '…' : lines.length}</span>
                        </span>
                        <span className="text-muted small">
                            {isLoading ? 'Calculating quantities…' : `${totalQty} units to pick`}
                        </span>
                    </div>
                </div>
                <form className="mt-2 w-100" onSubmit={handleSubmit}>
                    <label className="visually-hidden" htmlFor="picker-input">
                        Scan or type SKU/serial
                    </label>
                    <div className="input-group input-group-lg">
                        <input
                            id="picker-input"
                            type="text"
                            ref={inputRef}
                            className={`form-control border-2 ${
                                isFocused ? 'border-primary text-primary shadow-sm' : ''
                            }`}
                            placeholder="Scan or type SKU / serial number"
                            autoComplete="off"
                            value={scanValue}
                            onChange={handleChange}
                            onFocus={handleFocus(true)}
                            onBlur={handleFocus(false)}
                        />
                    </div>
                </form>
            </div>
        </nav>
    );
};
