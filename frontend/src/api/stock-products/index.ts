import axios from 'axios';

import {API_BASE_URL} from '../config';
import type {
    ProductHistoryRecord,
    ProductLocationHistoryRow,
    ProductSuggestion,
    StockProduct,
    StockRT
} from './types';

const BASE = `${API_BASE_URL}/stock_products`;

const headers = (token: string) => ({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
});

export const getProductByBarcode = async function (
    barcode: string,
    token: string
): Promise<StockProduct | undefined> {
    try {
        const res = await axios.get<StockProduct>(`${BASE}/barcode/${barcode}`, {headers: headers(token)});
        return res.data;
    } catch {
        return undefined;
    }
};

export const getProductById = async function (
    productStockId: number,
    token: string
): Promise<StockProduct | undefined> {
    try {
        const res = await axios.get<StockProduct>(`${BASE}/product/${productStockId}`, {headers: headers(token)});
        return res.data;
    } catch {
        return undefined;
    }
};

export const getProductByPlace = async function (
    location: string,
    token: string
): Promise<StockProduct[] | undefined> {
    try {
        const res = await axios.get<StockProduct[]>(`${BASE}/by-place/${location}`, {headers: headers(token)});
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) return undefined;
        throw error;
    }
};

export const getProductLocationHistory = async function (
    productId: number,
    token: string
): Promise<ProductHistoryRecord[]> {
    const res = await axios.get<ProductLocationHistoryRow | ProductLocationHistoryRow[]>(
        `${BASE}/product/${productId}/history`,
        {headers: headers(token)}
    );
    const rows = Array.isArray(res.data) ? res.data : [res.data];
    return rows.flatMap((row) => {
        const val = typeof row.warehouse_place_history === 'string'
            ? JSON.parse(row.warehouse_place_history)
            : row.warehouse_place_history;
        return Array.isArray(val) ? val : [];
    });
};

export const getStockRT = async function (productStockId: number, token: string): Promise<StockRT | undefined> {
    try {
        const res = await axios.get<StockRT>(`${BASE}/product/${productStockId}/stock-rt`, {
            headers: headers(token)
        });
        return res.data;
    } catch {
        return undefined;
    }
};

export const setProductStockLocation = async function (
    productStockId: number,
    location: string,
    token: string
): Promise<StockProduct> {
    const res = await axios.put<StockProduct>(
        `${BASE}/product/${productStockId}/location`,
        {location},
        {headers: headers(token)}
    );
    return res.data;
};

export const setAttentionNote = async function (
    productId: number,
    extraSpecs: Record<string, unknown>,
    token: string
): Promise<StockProduct> {
    const res = await axios.put<StockProduct>(
        `${BASE}/product/${productId}/extra-specs`,
        {extra_specs: extraSpecs},
        {headers: headers(token)}
    );
    return res.data;
};

export const searchProductSuggestions = async function (
    query: string,
    token: string
): Promise<ProductSuggestion[]> {
    const res = await axios.get<ProductSuggestion[]>(`${BASE}/search`, {
        params: {s: query},
        headers: headers(token)
    });
    return res.data;
};

export const logEvent = async function (
    event: string,
    valueText: string,
    valueInt1: number,
    valueInt2: number,
    valueRaw: Record<string, unknown>,
    token: string
): Promise<void> {
    await axios.post(
        `${BASE}/log`,
        {
            event,
            value_text: valueText,
            value_int1: valueInt1,
            value_int2: valueInt2,
            value_raw: valueRaw,
            expire_date: null
        },
        {headers: headers(token)}
    );
};
