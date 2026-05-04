import React, {useState} from 'react';

import {logEvent, setProductStockLocation} from '../../../api/stock-products';
import type {StockProduct} from '../../../api/stock-products/types';
import {useAuth} from '../../../hooks/auth';

type BtnVariant = 'btn btn-secondary text-white' | 'btn btn-success text-white' | 'btn btn-danger text-white';

interface Props {
    productStockId: number;
    productCode: string;
    productLocation: string;
    previousProduct: StockProduct[];
    isValid: boolean;
    isDisabled: boolean;
    setIsDisabled: (v: boolean) => void;
    setProductLocation: (v: string) => void;
    onSaveSuccess: () => void;
}

export const ButtonSave: React.FC<Props> = function ({
    productStockId,
    productCode,
    productLocation,
    previousProduct,
    isValid,
    isDisabled,
    setIsDisabled,
    setProductLocation,
    onSaveSuccess
}) {
    const {data: authData} = useAuth();
    const [btnVariant, setBtnVariant] = useState<BtnVariant>('btn btn-secondary text-white');

    const handleSave = async () => {
        setIsDisabled(true);
        const token = authData!.access_token;
        const userId = authData!.auth_user.username;

        try {
            if (!isValid) {
                if (productLocation === '') {
                    await setProductStockLocation(productStockId, '', token);
                    setBtnVariant('btn btn-success text-white');
                }
                return;
            }

            if (previousProduct.length > 0) {
                const confirmed = window.confirm(
                    `Do you want to force update the location to ${productLocation} for ${productCode}?`
                );
                if (!confirmed) return;
                await Promise.all(
                    previousProduct.map((p) => setProductStockLocation(p.product_stock_id ?? p.id, '', token))
                );
            }

            await setProductStockLocation(productStockId, productLocation, token);
            logEvent('LOG STOCK PRODUCTS', 'SAVE LOCATION', productStockId, 0, {productCode, productLocation, user: userId}, token);
            setBtnVariant('btn btn-success text-white');
            onSaveSuccess();
            setProductLocation(productLocation);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logEvent('LOG STOCK PRODUCTS', 'ERROR SAVE LOCATION', productStockId, 0, {productCode, productLocation, error: message, user: userId}, token);
            setBtnVariant('btn btn-danger text-white');
        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <div className="col-6 text-end px-0">
            <button className={btnVariant} type="button" onClick={handleSave} disabled={isDisabled}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                    <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.547l-3.5 2v3.805l3.5 2 3.5-2V9.547zm4 0v3.805l3.5 2 3.5-2V9.547l-3.5-2zm3.5-1.138L8.25 4.41l-3.5 2 3.5 2zm-7.25.07L1 8.409l3.5 2 3.5-2-3.5-2zM8.25 1.59 4.75 3.588 8.25 5.59l3.5-2z"/>
                </svg>
                {isDisabled ? ' Wait...' : ' Save place'}
            </button>
        </div>
    );
};
