import React, {useEffect, useState} from 'react';

import {logEvent} from '../../../api/stock-products';
import type {StockProduct} from '../../../api/stock-products/types';
import {useAuth} from '../../../hooks/auth';

const calcFallbackBarcode = (id: number, length = 12): string => id.toString().padStart(length, '0');

export const ButtonPrint: React.FC<{product: StockProduct}> = function ({product}) {
    const {data: authData} = useAuth();
    const [barcode, setBarcode] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!product) return;
        const bc = Array.isArray(product.barcodes) ? product.barcodes[0] : product.barcodes;
        if (!bc || bc === '0000000000000') {
            setBarcode(calcFallbackBarcode(product.id));
        } else {
            setBarcode(bc.slice(0, -1));
        }
    }, [product]);

    const handlePrint = async () => {
        const url = `#/stock-products/label?b=${barcode}&c=${product.code_simple}&w=${product.location}`;
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (win) win.opener = null;
        try {
            const token = authData!.access_token;
            const userId = authData!.auth_user.username;
            await logEvent('LOG STOCK PRODUCTS', 'PRINT LABEL', 0, 0, {product_code: product.code_simple, json_log: product, user: userId}, token);
        } catch {
            setError('Error saving print log.');
        }
    };

    return (
        <div className="my-3 row">
            {error && <div className="text-danger small mb-1">{error}</div>}
            <div className="col-12 text-center px-0">
                <button className="btn btn-warning text-white" type="button" onClick={handlePrint}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                        <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/>
                        <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1m0 5.586 7 7 4.586-4.586-7-7H2z"/>
                    </svg>
                    Print label
                </button>
            </div>
        </div>
    );
};
