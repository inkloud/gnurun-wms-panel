import React, {useCallback, useEffect, useRef, useState} from 'react';

import {getProductByBarcode, getProductById} from '../../../api/stock-products';
import type {StockProduct} from '../../../api/stock-products/types';
import {useAuth} from '../../../hooks/auth';

interface Props {
    barcode: string;
    setBarcode: (v: string) => void;
    setCurrentProduct: (p: StockProduct | null) => void;
    setProductCode: (v: string) => void;
}

export const InputBarcode: React.FC<Props> = function ({barcode, setBarcode, setCurrentProduct, setProductCode}) {
    const {data: authData} = useAuth();
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const fetchProduct = useCallback(
        async (code: string) => {
            const token = authData!.access_token;
            try {
                const product = await getProductByBarcode(code, token);
                if (product) {
                    const stockId = Array.isArray(product.barcodes)
                        ? product.product_stock_id
                        : product.product_stock_id;
                    const flat = await getProductById(stockId, token);
                    if (flat) {
                        setCurrentProduct(flat);
                        setProductCode(flat.code_simple);
                        return;
                    }
                    setCurrentProduct(product);
                    setProductCode(product.code_simple);
                } else {
                    setCurrentProduct(null);
                    setProductCode('');
                }
            } catch {
                setError('Error getting product by barcode.');
            }
        },
        [authData, setCurrentProduct, setProductCode]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== 'Enter') return;
            setProductCode('');
            setCurrentProduct(null);
            if (barcode.length === 12) {
                const padded = '0' + barcode;
                setBarcode(padded);
                fetchProduct(padded);
            } else if (barcode.length === 13) {
                fetchProduct(barcode);
            }
            inputRef.current?.select();
        },
        [barcode, setBarcode, setCurrentProduct, setProductCode, fetchProduct]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setProductCode('');
            setCurrentProduct(null);
            setBarcode(e.target.value);
        },
        [setBarcode, setCurrentProduct, setProductCode]
    );

    return (
        <div className="row align-items-center">
            <div className="col px-0 mb-3">
                <label htmlFor="barcode" className="form-label">
                    Barcode:
                </label>
                {error && <div className="text-danger small mb-1">{error}</div>}
                <input
                    ref={inputRef}
                    id="barcode"
                    type="text"
                    className="form-control"
                    placeholder="Barcode"
                    value={barcode}
                    maxLength={13}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};
