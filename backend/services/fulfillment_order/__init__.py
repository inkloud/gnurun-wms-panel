__all__ = ["FulfillmentOrderService"]

from ...data_gateway.types import (
    DBGateway,
    FulfillmentOrderProductRow,
    FulfillmentOrderRow,
)
from .ordering import order_by_position
from .types import FulfillmentOrder, FulfillmentOrderPosition, FulfillmentOrderProduct


def _encode_id(prefix: str, id: int) -> str:
    return f"{prefix}-{id:04d}"


def _decode_id(prefix: str, id: str) -> int:
    return int(id.split(f"{prefix}-")[1])


def _to_fulfillment_order(order: FulfillmentOrderRow) -> FulfillmentOrder:
    return FulfillmentOrder(
        id=_encode_id("FO", order.id),
        date=order.date,
        assigned_to=list(order.assigned_to),
    )


class FulfillmentOrderService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_ready(self) -> list[FulfillmentOrder]:
        return [
            _to_fulfillment_order(o) for o in self.data_mapper.fulfillment.get_ready()
        ]

    def assign(self, id: str, operator: str) -> FulfillmentOrder:
        updated: FulfillmentOrderRow = self.data_mapper.fulfillment.assign(
            _decode_id("FO", id), operator
        )
        return _to_fulfillment_order(updated)

    def unassign(self, id: str, operator: str) -> FulfillmentOrder:
        updated: FulfillmentOrderRow = self.data_mapper.fulfillment.unassign(
            _decode_id("FO", id), operator
        )
        return _to_fulfillment_order(updated)

    def get_products(self, fulfillment_order_id: str) -> list[FulfillmentOrderProduct]:
        products: list[FulfillmentOrderProductRow] = (
            self.data_mapper.fulfillment.get_products(
                _decode_id("FO", fulfillment_order_id)
            )
        )
        return [
            FulfillmentOrderProduct(
                id=_encode_id("PR", product.id),
                sku=product.sku,
                name=product.name,
                quantity=product.quantity,
                fulfillment_order_id=fulfillment_order_id,
                position=product.position,
            )
            for product in products
        ]

    def get_products_by_positions(
        self, fulfillment_order_id: str
    ) -> list[FulfillmentOrderPosition]:
        products = self.get_products(fulfillment_order_id)
        grouped: dict[str, list[FulfillmentOrderProduct]] = {}
        for product in products:
            grouped.setdefault(product.position, []).append(product)
        return order_by_position(
            [
                FulfillmentOrderPosition(position=position, products=items)
                for position, items in grouped.items()
            ]
        )
