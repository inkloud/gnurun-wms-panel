__all__ = ["FulfillmentOrderService"]

from ...domain.entities.fulfillment_order import (
    FulfillmentOrder,
    FulfillmentOrderPosition,
    FulfillmentOrderProduct,
    SimpleOrder,
    SimpleProduct,
)
from ...domain.interfaces.data_gateway import DBGateway
from .optimizer import order_by_position


def _decode_id(prefix: str, id: str) -> int:
    return int(id.split(f"{prefix}-")[1])


class FulfillmentOrderService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_ready(self) -> list[FulfillmentOrder]:
        return self.data_mapper.fulfillment.get_ready()

    def assign(self, id: str, operator: str) -> FulfillmentOrder:
        return self.data_mapper.fulfillment.assign(_decode_id("FO", id), operator)

    def unassign(self, id: str, operator: str) -> FulfillmentOrder:
        return self.data_mapper.fulfillment.unassign(_decode_id("FO", id), operator)

    def get_products(self, fulfillment_order_id: str) -> list[FulfillmentOrderProduct]:
        return self.data_mapper.fulfillment.get_products(
            _decode_id("FO", fulfillment_order_id)
        )

    def get_products_by_positions_list(
        self, fulfillment_order_id_list: list[str]
    ) -> list[FulfillmentOrderPosition]:
        products: list[FulfillmentOrderProduct] = []
        for fulfillment_order_id in fulfillment_order_id_list:
            products.extend(self.get_products(fulfillment_order_id))
        grouped: dict[str, list[FulfillmentOrderProduct]] = {}
        for product in products:
            grouped.setdefault(product.position, []).append(product)
        return order_by_position(
            [
                FulfillmentOrderPosition(
                    position=position,
                    product=SimpleProduct(
                        id=items[0].id, sku=items[0].sku, name=items[0].name
                    ),
                    orders=[
                        SimpleOrder(
                            id=item.fulfillment_order_id, quantity=item.quantity
                        )
                        for item in items
                    ],
                )
                for position, items in grouped.items()
            ]
        )
