__all__ = ["FulfillmentOrderService"]

from ...domain.entities.fulfillment_order import (
    FulfillmentOrder,
    FulfillmentOrderLine,
    FulfillmentOrderLinePick,
    FulfillmentOrderPosition,
    FulfillmentOrderSession,
    SimpleOrder,
    SimpleProduct,
)
from ..interfaces.data_gateway import DBGateway
from .optimizer import order_by_position


def _decode_id(prefix: str, id: str) -> int:
    return int(id.split(f"{prefix}-")[1])


class FulfillmentOrderService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_ready(self) -> list[FulfillmentOrder]:
        return self.data_mapper.fulfillment.get_ready()

    def get(self, id: str) -> FulfillmentOrder:
        return self.data_mapper.fulfillment.get(_decode_id("FO", id))

    def get_sessions(self, id: str) -> set[FulfillmentOrderSession]:
        return self.data_mapper.fulfillment.get_sessions(_decode_id("FO", id))

    def assign(self, id: str, operator: str) -> set[FulfillmentOrderSession]:
        return self.data_mapper.fulfillment.assign(_decode_id("FO", id), operator)

    def unassign(self, id: str, operator: str) -> set[FulfillmentOrderSession]:
        return self.data_mapper.fulfillment.unassign(_decode_id("FO", id), operator)

    def get_lines(self, fulfillment_order_id: str) -> list[FulfillmentOrderLine]:
        return self.data_mapper.fulfillment.get_lines(
            _decode_id("FO", fulfillment_order_id)
        )

    def new_pick(
        self,
        fulfillment_order_session_id: str,
        fulfillment_order_line_id: str,
        quantity_picked: int,
    ) -> FulfillmentOrderLinePick:
        return self.data_mapper.fulfillment.new_pick(
            fulfillment_order_session_id=fulfillment_order_session_id,
            fulfillment_order_line_id=fulfillment_order_line_id,
            quantity_picked=quantity_picked,
        )

    def get_picks(self) -> list[FulfillmentOrderLinePick]:
        return self.data_mapper.fulfillment.get_picks()

    def get_products_by_positions_list(
        self, fulfillment_order_id_list: list[str]
    ) -> list[FulfillmentOrderPosition]:
        products: list[FulfillmentOrderLine] = []
        for fulfillment_order_id in fulfillment_order_id_list:
            products.extend(self.get_lines(fulfillment_order_id))
        grouped: dict[str, list[FulfillmentOrderLine]] = {}
        for product in products:
            grouped.setdefault(product.position_code, []).append(product)
        return order_by_position(
            [
                FulfillmentOrderPosition(
                    position=position,
                    product=SimpleProduct(sku=items[0].sku, name=items[0].name),
                    orders=[
                        SimpleOrder(
                            id=item.fulfillment_order_id,
                            quantity=item.quantity_required,
                        )
                        for item in items
                    ],
                )
                for position, items in grouped.items()
            ]
        )
