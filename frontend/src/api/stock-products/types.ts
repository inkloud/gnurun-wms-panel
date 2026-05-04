export interface WarehousePlaceBackup {
    n: string;
    p: string;
    d: number;
    d_e?: number;
    q?: number;
    e?: number;
    a: boolean;
}

export interface StockProduct {
    id: number;
    product_stock_id: number;
    code_simple: string;
    barcode: string;
    barcodes: string | string[];
    location: string | null;
    stock: number;
    title: Record<string, string>;
    photos: string[];
    warehouse_places_backup: WarehousePlaceBackup[] | string | null;
    extra_specs: {
        attention_note?: {value: string; visible: boolean};
        [key: string]: unknown;
    } | null;
}

export interface ProductSuggestion {
    id: number;
    code_simple: string;
}

export interface ProductHistoryRecord {
    timestamp: string;
    warehouse_place: string;
}

export interface ProductLocationHistoryRow {
    warehouse_place_history: ProductHistoryRecord[] | string;
}

export interface StockRT {
    stock: number;
    code_simple: string;
    product_stock_id: number;
}
