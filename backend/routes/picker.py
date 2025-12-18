__all__ = ["router"]

from dataclasses import dataclass

from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel

from ..data_mapper.mock_db import DB
from ..domain.entities.auth import AuthPayload, AuthUserType
from ..domain.entities.fulfillment_order import (
    FulfillmentOrder,
    FulfillmentOrderLine,
    FulfillmentOrderLinePick,
    FulfillmentOrderPosition,
    FulfillmentOrderSession,
)
from ..services.auth import AuthService
from ..services.fulfillment_order import FulfillmentOrderService
from ..utils import get_token_from_header

router = APIRouter(prefix="/picker", tags=["picker"])


auth_service = AuthService(DB())
fulfillment_order_service = FulfillmentOrderService(DB())


@dataclass(frozen=True)
class FulfillmentOrderResponse:
    id: str
    created_at: str
    assigned_to: list[str]


def _to_fulfillment_order_response(order: FulfillmentOrder) -> FulfillmentOrderResponse:
    sessions: set[FulfillmentOrderSession] = fulfillment_order_service.get_sessions(
        order.id
    )
    assigned_to: list[str] = sorted({s.operator_id for s in sessions})
    return FulfillmentOrderResponse(
        id=order.id,
        created_at=order.created_at.isoformat(),
        assigned_to=assigned_to,
    )


def _authorize_operator(auth_header: str):
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


@router.get("")
async def hello_picker(
    auth_header: str = Header(..., alias="Authorization"),
) -> dict[str, str]:
    _authorize_operator(auth_header)
    return {"message": "Hello, Picker!"}


@router.get("/fulfillment_orders")
async def list_fulfillment_orders(
    auth_header: str = Header(..., alias="Authorization"),
) -> list[FulfillmentOrderResponse]:
    _authorize_operator(auth_header)
    return [
        _to_fulfillment_order_response(order)
        for order in fulfillment_order_service.get_ready()
    ]


@router.get("/fulfillment_orders/{fulfillment_order_id}/products")
async def list_fulfillment_order_products(
    fulfillment_order_id: str, auth_header: str = Header(..., alias="Authorization")
) -> list[FulfillmentOrderLine]:
    _authorize_operator(auth_header)
    return fulfillment_order_service.get_lines(fulfillment_order_id)


@router.get("/fulfillment_orders/{fulfillment_order_id_list}/positions")
async def list_fulfillment_order_positions(
    fulfillment_order_id_list: str,
    auth_header: str = Header(..., alias="Authorization"),
) -> list[FulfillmentOrderPosition]:
    _authorize_operator(auth_header)
    return fulfillment_order_service.get_products_by_positions_list(
        fulfillment_order_id_list.split(",")
    )


@router.put("/assign/{fulfillment_order_id}")
async def assign_fulfillment_order(
    fulfillment_order_id: str, auth_header: str = Header(..., alias="Authorization")
) -> FulfillmentOrderResponse:
    auth_payload: AuthPayload = _authorize_operator(auth_header)
    assert auth_payload.auth_user.type == AuthUserType.OPERATOR
    operator: str = auth_payload.auth_user.username
    fulfillment_order_service.assign(fulfillment_order_id, operator)
    return _to_fulfillment_order_response(
        fulfillment_order_service.get(fulfillment_order_id)
    )


@router.put("/unassign/{fulfillment_order_id}")
async def unassign_fulfillment_order(
    fulfillment_order_id: str, auth_header: str = Header(..., alias="Authorization")
) -> FulfillmentOrderResponse:
    auth_payload: AuthPayload = _authorize_operator(auth_header)
    assert auth_payload.auth_user.type == AuthUserType.OPERATOR
    operator: str = auth_payload.auth_user.username
    fulfillment_order_service.unassign(fulfillment_order_id, operator)
    return _to_fulfillment_order_response(
        fulfillment_order_service.get(fulfillment_order_id)
    )


class PickRequest(BaseModel):
    position_code: str
    fulfillment_order_id: str
    qty: int


@router.post("/pick")
async def create_pick(
    payload: PickRequest, auth_header: str = Header(..., alias="Authorization")
) -> FulfillmentOrderLinePick:
    auth_payload: AuthPayload = _authorize_operator(auth_header)
    assert auth_payload.auth_user.type == AuthUserType.OPERATOR

    if payload.qty <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="qty must be > 0"
        )

    sessions: set[FulfillmentOrderSession] = fulfillment_order_service.get_sessions(
        payload.fulfillment_order_id
    )
    session_matches = [
        session
        for session in sessions
        if session.operator_id == auth_payload.auth_user.username
    ]
    if len(session_matches) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fulfillment order session not found",
        )
    session: FulfillmentOrderSession = sorted(
        session_matches, key=lambda item: item.id
    )[0]

    lines: list[FulfillmentOrderLine] = fulfillment_order_service.get_lines(
        payload.fulfillment_order_id
    )
    line_matches = [
        line for line in lines if line.position_code == payload.position_code
    ]
    if len(line_matches) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fulfillment order line not found",
        )
    line: FulfillmentOrderLine = sorted(line_matches, key=lambda item: item.id)[0]

    return fulfillment_order_service.new_pick(
        fulfillment_order_session_id=session.id,
        fulfillment_order_line_id=line.id,
        quantity_picked=payload.qty,
    )
