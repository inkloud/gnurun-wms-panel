import React, {useEffect, useState} from 'react';

import {getProductById, searchProductSuggestions} from '../../../api/stock-products';
import type {ProductSuggestion, StockProduct} from '../../../api/stock-products/types';
import {useAuth} from '../../../hooks/auth';

interface Props {
    productCode: string;
    setProductCode: (v: string) => void;
    currentProduct: StockProduct | null;
    setCurrentProduct: (p: StockProduct | null) => void;
    setBarcode: (v: string) => void;
}

export const InputProduct: React.FC<Props> = function ({
    productCode,
    setProductCode,
    currentProduct,
    setCurrentProduct,
    setBarcode
}) {
    const {data: authData} = useAuth();
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (currentProduct) setProductCode(currentProduct.code_simple);
    }, [currentProduct, setProductCode]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBarcode('');
        setCurrentProduct(null);
        setProductCode(value);
        setShowSuggestions(true);
        if (value.length >= 4) {
            try {
                const results = await searchProductSuggestions(value, authData!.access_token);
                setSuggestions(results);
            } catch {
                setError('Error fetching product suggestions.');
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = async (suggestion: ProductSuggestion) => {
        setProductCode(suggestion.code_simple);
        setShowSuggestions(false);
        try {
            const product = await getProductById(suggestion.id, authData!.access_token);
            if (product) {
                setBarcode(product.barcode ?? '');
                setCurrentProduct(product);
            } else {
                setBarcode('');
                setProductCode('');
                setCurrentProduct(null);
            }
        } catch {
            setError('Error fetching product by id.');
        }
    };

    return (
        <>
            <div className="row align-items-center">
                <div className="col px-0">
                    <label htmlFor="productCode" className="form-label">
                        Product code:
                    </label>
                    {error && <div className="text-danger small mb-1">{error}</div>}
                    <input
                        id="productCode"
                        type="text"
                        className="form-control"
                        placeholder="Product Code"
                        value={productCode}
                        onChange={handleChange}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                </div>
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <div className="row align-items-center">
                    <div className="col px-0">
                        <div className="suggestions-list form-control">
                            {suggestions.map((s) => (
                                <div key={s.id} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>
                                    {s.code_simple}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
