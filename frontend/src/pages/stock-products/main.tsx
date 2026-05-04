import React, {useEffect, useState} from 'react';

import {logEvent} from '../../api/stock-products';
import type {StockProduct} from '../../api/stock-products/types';
import {useAuth} from '../../hooks/auth';
import {ButtonPrint} from './ui/button-print';
import {InputBarcode} from './ui/input-barcode';
import {InputProduct} from './ui/input-product';
import {Label39} from './ui/label-39';
import {ProductInfo} from './ui/product-info';
import {TableProdPlace} from './ui/table-prod-place';
import {SearchByPlace} from './work/by-place';
import {EditLocation} from './work/edit-location';
import {Notes} from './work/notes';
import {StockUp} from './work/stock-up';

export const MainPanel: React.FC = function () {
    const {data: authData} = useAuth();
    const [barcode, setBarcode] = useState('');
    const [productCode, setProductCode] = useState('');
    const [currentProduct, setCurrentProduct] = useState<StockProduct | null>(null);

    useEffect(() => {
        if (!currentProduct) return;
        const token = authData!.access_token;
        const userId = authData!.auth_user.username;
        logEvent(
            'LOG STOCK PRODUCTS',
            'SEARCH PRODUCT',
            currentProduct.product_stock_id,
            0,
            {product_code: currentProduct.code_simple, user: userId},
            token
        ).catch(console.error);
    }, [currentProduct]);

    return (
        <div className="container-fluid">
            <InputBarcode
                barcode={barcode}
                setBarcode={setBarcode}
                setCurrentProduct={setCurrentProduct}
                setProductCode={setProductCode}
            />
            <InputProduct
                productCode={productCode}
                setProductCode={setProductCode}
                currentProduct={currentProduct}
                setCurrentProduct={setCurrentProduct}
                setBarcode={setBarcode}
            />
            {currentProduct && (
                <>
                    <EditLocation data={currentProduct} />
                    <ProductInfo product={currentProduct} />
                    <ButtonPrint product={currentProduct} />
                    <Notes product={currentProduct} />
                </>
            )}
            <Label39 />
            <SearchByPlace />
            <StockUp />
            {currentProduct && <TableProdPlace productInfo={currentProduct} />}
        </div>
    );
};
