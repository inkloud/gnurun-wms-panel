import React from 'react';

import type {StockProduct} from '../../../api/stock-products/types';

interface Props {
    previousProduct: StockProduct;
    productCode: string;
}

export const WarningMessage: React.FC<Props> = function ({previousProduct, productCode}) {
    if (previousProduct.code_simple === productCode) return null;
    return (
        <div className="mb-3 col-12 px-0 text-danger">
            <small>
                The selected position is already occupied by: <strong>{previousProduct.code_simple}</strong>, with
                quantity: <strong>{previousProduct.stock}</strong>
            </small>
        </div>
    );
};
