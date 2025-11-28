__all__ = ["FulfillmentOrderService"]

from ...data_gateway.types import (
    DBGateway,
    FulfillmentOrderProductRow,
    FulfillmentOrderRow,
)
from .types import FulfillmentOrder, FulfillmentOrderProduct


def _encode_id(id: int) -> str:
    return f"FO-{id:04d}"


def _decode_id(id: str) -> int:
    return int(id.split("FO-")[1])


def _to_fulfillment_order(order: FulfillmentOrderRow) -> FulfillmentOrder:
    return FulfillmentOrder(
        id=_encode_id(order.id), date=order.date, assigned_to=list(order.assigned_to)
    )


class FulfillmentOrderService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_fulfillment_orders(self) -> list[FulfillmentOrder]:
        return [
            _to_fulfillment_order(order)
            for order in self.data_mapper.fulfillment.get_fulfillment_orders()
        ]

    def assign_fulfillment_orders(self, id: str, operator: str) -> FulfillmentOrder:
        updated: FulfillmentOrderRow = self.data_mapper.fulfillment.assign(
            _decode_id(id), operator
        )
        return _to_fulfillment_order(updated)

    def unassign_fulfillment_orders(self, id: str, operator: str) -> FulfillmentOrder:
        updated: FulfillmentOrderRow = self.data_mapper.fulfillment.unassign(
            _decode_id(id), operator
        )
        return _to_fulfillment_order(updated)

    def get_products(self, fulfillment_order_id: str) -> list[FulfillmentOrderProduct]:
        products: list[FulfillmentOrderProductRow] = (
            self.data_mapper.fulfillment.get_products(_decode_id(fulfillment_order_id))
        )
        return [
            FulfillmentOrderProduct(
                id=product.id,
                sku=product.sku,
                name=product.name,
                quantity=product.quantity,
                fulfillment_order_id=product.fulfillment_order_id,
                position=product.position,
            )
            for product in products
        ]
