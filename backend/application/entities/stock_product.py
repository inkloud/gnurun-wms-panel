__all__ = [
    "StockProduct",
    "WarehousePlaceBackup",
    "ProductHistoryRecord",
    "StockRT",
]

from dataclasses import dataclass


@dataclass(frozen=True)
class WarehousePlaceBackup:
    notes: str
    place: str
    date: int
    empty_date: int | None
    qty_boxes: int | None
    qty_per_box: int | None
    active: bool


@dataclass(frozen=True)
class StockProduct:
    id: int
    product_stock_id: int
    code_simple: str
    barcode: str
    location: str | None
    stock: int


@dataclass(frozen=True)
class ProductHistoryRecord:
    timestamp: str
    warehouse_place: str


@dataclass(frozen=True)
class StockRT:
    stock: int
    code_simple: str
    product_stock_id: int
