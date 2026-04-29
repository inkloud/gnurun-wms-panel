from backend.application.entities.fulfillment_order import (
    FulfillmentOrder,
    FulfillmentOrderLine,
)
from backend.application.ports.data_gateway import FulfillmentOrderGateway

from .fulfillment_orders import FULFILLMENT_ORDERS, FULFILLMENT_ORDERS_PRODUCTS
from .ids import encode_id
from .types import FulfillmentOrderRow


def _get_fulfillment_order_row(id: int) -> FulfillmentOrderRow:
    res: list[FulfillmentOrderRow] = [f for f in FULFILLMENT_ORDERS if f.id == id]
    assert len(res) == 1
    return res[0]


class MockFulfillmentOrderGateway(FulfillmentOrderGateway):
    @staticmethod
    def get_ready(warehouse_id: int) -> list[FulfillmentOrder]:
        data: list[FulfillmentOrder] = [
            FulfillmentOrder(id=encode_id("FO", f.id), created_at=f.date)
            for f in FULFILLMENT_ORDERS
            if f.warehouse_id == warehouse_id
        ]
        return sorted(data, key=lambda order: order.created_at)

    @staticmethod
    def get(id: int) -> FulfillmentOrder:
        data: FulfillmentOrderRow = _get_fulfillment_order_row(id)
        return FulfillmentOrder(
            id=encode_id("FO", data.id),
            created_at=data.date,
        )

    @staticmethod
    def get_lines(id: int) -> list[FulfillmentOrderLine]:
        return [
            FulfillmentOrderLine(
                id=encode_id("FO-LINE", e.id),
                fulfillment_order_id=encode_id("FO", e.fulfillment_order_id),
                sku=e.sku,
                position_code=e.position_code,
                quantity_required=e.quantity_required,
                name=e.name,
                requires_serial_tracking=e.requires_serial_tracking,
            )
            for e in FULFILLMENT_ORDERS_PRODUCTS
            if e.fulfillment_order_id == id
        ]
