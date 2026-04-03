from datetime import datetime

from backend.application.entities.fulfillment_order import FulfillmentOrderAssignment
from backend.application.ports.data_gateway import FulfillmentOrderAssignmentGateway

from .fulfillment_order_gateway import MockFulfillmentOrderGateway
from .fulfillment_orders import FULFILLMENT_ORDER_ASSIGNMENTS
from .ids import encode_id
from .types import FulfillmentOrderAssignmentRow


def _get_fulfillment_order_assignments(id: int) -> set[FulfillmentOrderAssignment]:
    return {
        FulfillmentOrderAssignment(
            id=encode_id("FO-ASSIGN", row.id),
            operator_id=row.operator_id,
            fulfillment_order_id=encode_id("FO", row.fulfillment_order_id),
            started_at=row.started_at,
        )
        for row in FULFILLMENT_ORDER_ASSIGNMENTS
        if row.fulfillment_order_id == id
    }


class MockFulfillmentOrderAssignmentGateway(FulfillmentOrderAssignmentGateway):
    @staticmethod
    def get_assignments(id: int) -> set[FulfillmentOrderAssignment]:
        return _get_fulfillment_order_assignments(id)

    @staticmethod
    def assign(id: int, operator: str) -> set[FulfillmentOrderAssignment]:
        MockFulfillmentOrderGateway.get(id)
        if not any(
            row.fulfillment_order_id == id and row.operator_id == operator
            for row in FULFILLMENT_ORDER_ASSIGNMENTS
        ):
            FULFILLMENT_ORDER_ASSIGNMENTS.append(
                FulfillmentOrderAssignmentRow(
                    id=max((row.id for row in FULFILLMENT_ORDER_ASSIGNMENTS), default=0)
                    + 1,
                    operator_id=operator,
                    fulfillment_order_id=id,
                    started_at=datetime.now(),
                )
            )
        return _get_fulfillment_order_assignments(id)

    @staticmethod
    def unassign(id: int, operator: str) -> set[FulfillmentOrderAssignment]:
        MockFulfillmentOrderGateway.get(id)
        FULFILLMENT_ORDER_ASSIGNMENTS[:] = [
            row
            for row in FULFILLMENT_ORDER_ASSIGNMENTS
            if not (row.fulfillment_order_id == id and row.operator_id == operator)
        ]
        return _get_fulfillment_order_assignments(id)
