import React, {useEffect, useState} from 'react';

import {getProductByPlace} from '../../../api/stock-products';
import type {StockProduct} from '../../../api/stock-products/types';
import {useAuth} from '../../../hooks/auth';

const LOCATION_REGEX = /^[A-Z]\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}$/;

const sanitizePosition = (value: string): [boolean, string] => {
    let cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length > 1) cleaned = cleaned.slice(0, 1) + '.' + cleaned.slice(1);
    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4) + '.' + cleaned.slice(4);
    if (cleaned.length > 7) cleaned = cleaned.slice(0, 7) + '.' + cleaned.slice(7);
    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);
    return [LOCATION_REGEX.test(cleaned), cleaned];
};

interface Props {
    data: StockProduct;
    productLocation: string;
    setProductLocation: (v: string) => void;
    setPreviousProduct: (p: StockProduct[]) => void;
    isValid: boolean;
    setIsValid: (v: boolean) => void;
    setIsDisabled: (v: boolean) => void;
}

export const InputLocation: React.FC<Props> = function ({
    data,
    productLocation,
    setProductLocation,
    setPreviousProduct,
    isValid,
    setIsValid,
    setIsDisabled
}) {
    const {data: authData} = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (data?.location) {
            const [valid, value] = sanitizePosition(data.location);
            setProductLocation(value);
            setIsValid(valid);
        } else {
            setProductLocation('');
        }
    }, [data, setProductLocation, setIsValid]);

    useEffect(() => {
        if (isValid) fetchPrevProduct(productLocation);
    }, [isValid, productLocation]);

    const fetchPrevProduct = async (location: string) => {
        setPreviousProduct([]);
        try {
            setIsDisabled(true);
            const previous = await getProductByPlace(location, authData!.access_token);
            setPreviousProduct(previous ?? []);
        } catch {
            setError('Error searching product by location.');
        } finally {
            setIsDisabled(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [valid, value] = sanitizePosition(e.target.value);
        setIsValid(valid);
        setProductLocation(value);
    };

    return (
        <div className="mb-3 col-12 px-0">
            <label htmlFor="productLocation" className="form-label">
                Location:
            </label>
            {!isValid && productLocation.length > 0 && (
                <p className="text-danger small mb-1">
                    Product location code must start with a letter, followed by 6 numbers.
                </p>
            )}
            {error && <div className="text-danger small mb-1">{error}</div>}
            <input
                id="productLocation"
                type="text"
                className="form-control"
                placeholder="X.00.00.00"
                maxLength={10}
                value={productLocation}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            />
        </div>
    );
};
