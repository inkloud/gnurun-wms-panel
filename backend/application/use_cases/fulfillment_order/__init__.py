__all__ = ["FulfillmentOrderService"]

from backend.application.entities.fulfillment_order import (
    FulfillmentOrder,
    FulfillmentOrderAssignment,
    FulfillmentOrderLine,
    FulfillmentOrderLinePick,
    FulfillmentOrderPosition,
    SimpleOrder,
    SimpleProduct,
)
from backend.application.ports.data_gateway import DBGateway

from .optimizer import order_by_position


def _decode_id(prefix: str, id: str) -> int:
    return int(id.split(f"{prefix}-")[1])


class FulfillmentOrderService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_ready(self) -> list[FulfillmentOrder]:
        return self.data_mapper.fulfillment_order.get_ready()

    def get(self, id: str) -> FulfillmentOrder:
        return self.data_mapper.fulfillment_order.get(_decode_id("FO", id))

    def get_assignments(self, id: str) -> set[FulfillmentOrderAssignment]:
        return self.data_mapper.fulfillment_assignment.get_assignments(
            _decode_id("FO", id)
        )

    def assign(self, id: str, operator: str) -> set[FulfillmentOrderAssignment]:
        return self.data_mapper.fulfillment_assignment.assign(
            _decode_id("FO", id), operator
        )

    def unassign(self, id: str, operator: str) -> set[FulfillmentOrderAssignment]:
        return self.data_mapper.fulfillment_assignment.unassign(
            _decode_id("FO", id), operator
        )

    def get_lines(self, fulfillment_order_id: str) -> list[FulfillmentOrderLine]:
        return self.data_mapper.fulfillment_order.get_lines(
            _decode_id("FO", fulfillment_order_id)
        )

    def new_pick(
        self,
        fulfillment_order_assignment_id: str,
        fulfillment_order_line_id: str,
        quantity_picked: int,
        serial_numbers: list[str],
    ) -> FulfillmentOrderLinePick:
        return self.data_mapper.fulfillment_pick.new_pick(
            fulfillment_order_assignment_id=fulfillment_order_assignment_id,
            fulfillment_order_line_id=fulfillment_order_line_id,
            quantity_picked=quantity_picked,
            serial_numbers=serial_numbers,
        )

    def get_picks(self) -> list[FulfillmentOrderLinePick]:
        return self.data_mapper.fulfillment_pick.get_picks()

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
                    product=SimpleProduct(
                        sku=items[0].sku,
                        name=items[0].name,
                        requires_serial_tracking=items[0].requires_serial_tracking,
                    ),
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
