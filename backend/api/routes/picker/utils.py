__all__ = [
    "authorize_operator",
    "get_operator_fulfillment_order_assignment",
    "get_fulfillment_order_line",
    "get_fulfillment_order_pick_details",
    "FulfillmentOrderResponse",
    "FulfillmentOrderPickDetail",
]

from dataclasses import dataclass
from datetime import datetime

from fastapi import HTTPException, status

from backend.application.entities.auth import AuthPayload, AuthUserType
from backend.application.entities.fulfillment_order import (
    FulfillmentOrderAssignment,
    FulfillmentOrder,
    FulfillmentOrderLine,
    FulfillmentOrderLinePick,
)
from backend.application.use_cases.auth import AuthService
from backend.application.use_cases.fulfillment_order import FulfillmentOrderService

from ..utils import get_token_from_header


@dataclass(frozen=True)
class FulfillmentOrderResponse:
    id: str
    created_at: str
    assigned_to: list[str]

    @classmethod
    def from_fulfillment_order(
        cls, order: FulfillmentOrder, fulfillment_order_service: FulfillmentOrderService
    ) -> "FulfillmentOrderResponse":
        assignments: set[FulfillmentOrderAssignment] = (
            fulfillment_order_service.get_assignments(order.id)
        )
        assigned_to: list[str] = sorted({a.operator_id for a in assignments})
        return cls(
            id=order.id,
            created_at=order.created_at.isoformat(),
            assigned_to=assigned_to,
        )


@dataclass(frozen=True)
class FulfillmentOrderPickDetail:
    operator_id: str
    fulfillment_order_id: str
    sku: str
    position_code: str
    quantity_picked: int
    serial_numbers: list[str]
    picked_at: datetime


def authorize_operator(auth_service: AuthService, auth_header: str) -> AuthPayload:
    token: str | None = get_token_from_header(auth_header)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer scheme",
        )
    try:
        auth_payload: AuthPayload = auth_service.check_token(token)
        assert auth_payload.auth_user.type == AuthUserType.OPERATOR
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc
    return auth_payload


def get_operator_fulfillment_order_assignment(
    fulfillment_order_service: FulfillmentOrderService,
    fulfillment_order_id: str,
    operator_id: str,
) -> FulfillmentOrderAssignment:
    assignments: set[FulfillmentOrderAssignment] = (
        fulfillment_order_service.get_assignments(
        fulfillment_order_id
    )
    )
    assignment_matches = [
        assignment
        for assignment in assignments
        if assignment.operator_id == operator_id
    ]
    if len(assignment_matches) == 0:
        raise ValueError("Fulfillment order assignment not found")
    return sorted(assignment_matches, key=lambda item: item.id)[0]


def get_fulfillment_order_line(
    fulfillment_order_service: FulfillmentOrderService,
    fulfillment_order_id: str,
    position_code: str,
) -> FulfillmentOrderLine:
    lines: list[FulfillmentOrderLine] = fulfillment_order_service.get_lines(
        fulfillment_order_id
    )
    line_matches = [line for line in lines if line.position_code == position_code]
    if len(line_matches) == 0:
        raise ValueError("Fulfillment order line not found")
    return sorted(line_matches, key=lambda item: item.id)[0]


def get_fulfillment_order_pick_details(
    fulfillment_order_service: FulfillmentOrderService, fulfillment_order_id: str
) -> list[FulfillmentOrderPickDetail]:
    assignments: list[FulfillmentOrderAssignment] = list(
        fulfillment_order_service.get_assignments(fulfillment_order_id)
    )
    lines: list[FulfillmentOrderLine] = fulfillment_order_service.get_lines(
        fulfillment_order_id
    )

    assignment_by_id = {assignment.id: assignment for assignment in assignments}
    line_by_id = {line.id: line for line in lines}
    picks: list[FulfillmentOrderLinePick] = [
        pick
        for pick in fulfillment_order_service.get_picks()
        if pick.fulfillment_order_assignment_id in assignment_by_id
        and pick.fulfillment_order_line_id in line_by_id
    ]
    return [
        FulfillmentOrderPickDetail(
            operator_id=assignment_by_id[
                pick.fulfillment_order_assignment_id
            ].operator_id,
            fulfillment_order_id=line_by_id[
                pick.fulfillment_order_line_id
            ].fulfillment_order_id,
            sku=line_by_id[pick.fulfillment_order_line_id].sku,
            position_code=line_by_id[pick.fulfillment_order_line_id].position_code,
            quantity_picked=pick.quantity_picked,
            serial_numbers=pick.serial_numbers,
            picked_at=pick.picked_at,
        )
        for pick in picks
    ]
