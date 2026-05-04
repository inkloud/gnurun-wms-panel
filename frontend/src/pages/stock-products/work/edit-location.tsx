import React, {useState} from 'react';

import type {StockProduct} from '../../../api/stock-products/types';
import {ButtonSave} from '../ui/button-save';
import {InputLocation} from '../ui/input-location';
import {WarningMessage} from '../ui/warning-msg';
import {History} from './history';

export const EditLocation: React.FC<{data: StockProduct}> = function ({data}) {
    const [productLocation, setProductLocation] = useState('');
    const [previousProduct, setPreviousProduct] = useState<StockProduct[]>([]);
    const [isValid, setIsValid] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleSaveSuccess = () => {
        setShowHistory(false);
        setPreviousProduct([]);
        setProductLocation(data.location ?? '');
    };

    return (
        <form>
            <div className="my-3 row">
                <InputLocation
                    data={data}
                    productLocation={productLocation}
                    setProductLocation={setProductLocation}
                    setPreviousProduct={setPreviousProduct}
                    isValid={isValid}
                    setIsValid={setIsValid}
                    setIsDisabled={setIsDisabled}
                />
                {previousProduct.map((prev) => (
                    <WarningMessage key={prev.id} previousProduct={prev} productCode={data.code_simple} />
                ))}
                <History productId={data.id} showHistory={showHistory} setShowHistory={setShowHistory} />
                <ButtonSave
                    productStockId={data.product_stock_id}
                    productCode={data.code_simple}
                    productLocation={productLocation}
                    previousProduct={previousProduct}
                    isValid={isValid}
                    isDisabled={isDisabled}
                    setIsDisabled={setIsDisabled}
                    setProductLocation={setProductLocation}
                    onSaveSuccess={handleSaveSuccess}
                />
            </div>
        </form>
    );
};
