import React, {useState} from 'react';

import {getProductLocationHistory} from '../../../api/stock-products';
import type {ProductHistoryRecord} from '../../../api/stock-products/types';
import {useAuth} from '../../../hooks/auth';

interface Props {
    productId: number;
    showHistory: boolean;
    setShowHistory: (v: boolean) => void;
}

export const History: React.FC<Props> = function ({productId, showHistory, setShowHistory}) {
    const {data: authData} = useAuth();
    const [records, setRecords] = useState<ProductHistoryRecord[]>([]);
    const [error, setError] = useState(false);

    const toggle = async () => {
        setShowHistory(!showHistory);
        try {
            const token = authData!.access_token;
            const history = await getProductLocationHistory(productId, token);
            const sorted = [...history]
                .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                .slice(0, 10)
                .map((r) => ({timestamp: r.timestamp.slice(0, 10), warehouse_place: r.warehouse_place}));
            setRecords(sorted);
        } catch {
            setError(true);
        }
    };

    return (
        <>
            {showHistory && (
                <div className="my-3 col-12 px-0">
                    {records.length > 0 ? (
                        <>
                            <h4>Product Location History</h4>
                            {records.map((r, idx) => (
                                <div key={idx}>
                                    On date: {r.timestamp} was in: {r.warehouse_place}
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>The selected product does not have a history yet.</p>
                    )}
                </div>
            )}
            <div className="col-6 text-end px-0">
                <button className="btn btn-outline-secondary" type="button" onClick={toggle}>
                    History
                </button>
            </div>
            {error && <p className="text-danger">Something went wrong! Contact the IT team!</p>}
        </>
    );
};
