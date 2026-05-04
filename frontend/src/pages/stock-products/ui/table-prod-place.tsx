import React from 'react';

import type {StockProduct, WarehousePlaceBackup} from '../../../api/stock-products/types';

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
});

const parseBackup = (raw: StockProduct['warehouse_places_backup']): WarehousePlaceBackup[] => {
    if (raw == null) return [];
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            return [];
        }
    }
    return Array.isArray(raw) ? raw : [raw];
};

export const TableProdPlace: React.FC<{productInfo: StockProduct}> = function ({productInfo}) {
    const backupPlaces = parseBackup(productInfo.warehouse_places_backup);

    const rows =
        backupPlaces.length === 0 ? (
            <tr>
                <td colSpan={5}>No backup data available</td>
            </tr>
        ) : (
            [...backupPlaces]
                .sort((a, b) => b.d - a.d)
                .map((entry, idx) => {
                    const qtyLabel = [
                        entry.q != null ? `${entry.q}bx` : '',
                        entry.e != null ? ` x ${entry.e}pcs` : ''
                    ]
                        .join('')
                        .trim();
                    return (
                        <tr key={idx} className={entry.a ? 'table-success' : 'table-danger'}>
                            <td>
                                <strong>{entry.n}</strong>
                            </td>
                            <td>{entry.p}</td>
                            <td>{DATE_FORMAT.format(entry.d)}</td>
                            <td>{entry.d_e != null ? DATE_FORMAT.format(entry.d_e) : null}</td>
                            <td>{qtyLabel}</td>
                        </tr>
                    );
                })
        );

    return (
        <div className="container-fluid mt-2">
            <div className="row">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Notes</th>
                            <th scope="col">Place</th>
                            <th scope="col">Date</th>
                            <th scope="col">Empty Date</th>
                            <th scope="col">Qty</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        </div>
    );
};
