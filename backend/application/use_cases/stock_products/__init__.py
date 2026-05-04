__all__ = ["StockProductService"]

from backend.application.entities.stock_product import (
    ProductHistoryRecord,
    StockProduct,
    StockRT,
)
from backend.application.ports.data_gateway import DBGateway


class StockProductService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_by_barcode(self, barcode: str) -> StockProduct | None:
        pass

    def get_by_id(self, product_stock_id: int) -> StockProduct | None:
        pass

    def get_by_place(self, location: str) -> list[StockProduct]:
        pass

    def get_location_history(self, product_id: int) -> list[ProductHistoryRecord]:
        pass

    def get_stock_rt(self, product_stock_id: int) -> StockRT | None:
        pass

    def set_location(self, product_stock_id: int, location: str) -> StockProduct:
        pass

    def set_extra_specs(self, product_id: int, extra_specs: dict) -> StockProduct:
        pass

    def search_suggestions(self, query: str) -> list[StockProduct]:
        pass

    def log_event(
        self,
        event: str,
        value_text: str,
        value_int1: int,
        value_int2: int,
        value_raw: dict,
    ) -> None:
        pass
