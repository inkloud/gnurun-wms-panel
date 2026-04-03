from datetime import datetime

from backend.application.entities.fulfillment_order import FulfillmentOrderLinePick
from backend.application.ports.data_gateway import FulfillmentPickGateway

from .fulfillment_orders import (
    FULFILLMENT_ORDER_ASSIGNMENTS,
    FULFILLMENT_ORDER_LINE_PICKS,
    FULFILLMENT_ORDERS_PRODUCTS,
)
from .ids import decode_id, encode_id
from .types import (
    FulfillmentOrderAssignmentRow,
    FulfillmentOrderLinePickRow,
    FulfillmentOrderLineRow,
)


class MockFulfillmentPickGateway(FulfillmentPickGateway):
    @staticmethod
    def new_pick(
        fulfillment_order_assignment_id: str,
        fulfillment_order_line_id: str,
        quantity_picked: int,
        serial_numbers: list[str],
    ) -> FulfillmentOrderLinePick:
        if quantity_picked <= 0:
            raise ValueError("quantity_picked must be > 0")

        assignment_id: int = decode_id("FO-ASSIGN", fulfillment_order_assignment_id)
        assignment_rows: list[FulfillmentOrderAssignmentRow] = [
            row for row in FULFILLMENT_ORDER_ASSIGNMENTS if row.id == assignment_id
        ]
        assert len(assignment_rows) > 0
        assignment_row: FulfillmentOrderAssignmentRow = assignment_rows[0]

        line_id: int = decode_id("FO-LINE", fulfillment_order_line_id)
        line_rows: list[FulfillmentOrderLineRow] = [
            row
            for row in FULFILLMENT_ORDERS_PRODUCTS
            if row.id == line_id
            and row.fulfillment_order_id == assignment_row.fulfillment_order_id
        ]
        assert len(line_rows) > 0

        row_id = max((row.id for row in FULFILLMENT_ORDER_LINE_PICKS), default=0) + 1
        pick_row = FulfillmentOrderLinePickRow(
            id=row_id,
            fulfillment_order_assignment_id=assignment_id,
            fulfillment_order_line_id=line_id,
            quantity_picked=quantity_picked,
            serial_numbers=list(serial_numbers),
            picked_at=datetime.now(),
        )
        FULFILLMENT_ORDER_LINE_PICKS.append(pick_row)

        return FulfillmentOrderLinePick(
            id=encode_id("LINE-PICK", pick_row.id),
            fulfillment_order_assignment_id=fulfillment_order_assignment_id,
            fulfillment_order_line_id=fulfillment_order_line_id,
            quantity_picked=pick_row.quantity_picked,
            serial_numbers=list(pick_row.serial_numbers),
            picked_at=pick_row.picked_at,
        )

    @staticmethod
    def get_picks() -> list[FulfillmentOrderLinePick]:
        return [
            FulfillmentOrderLinePick(
                id=encode_id("LINE-PICK", row.id),
                fulfillment_order_assignment_id=encode_id(
                    "FO-ASSIGN", row.fulfillment_order_assignment_id
                ),
                fulfillment_order_line_id=encode_id(
                    "FO-LINE", row.fulfillment_order_line_id
                ),
                quantity_picked=row.quantity_picked,
                serial_numbers=list(row.serial_numbers),
                picked_at=row.picked_at,
            )
            for row in FULFILLMENT_ORDER_LINE_PICKS
        ]
