__all__ = ["router"]

from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel

from backend.application.entities.auth import AuthPayload, AuthUserType
from backend.application.entities.fulfillment_order import (
    FulfillmentOrderLine,
    FulfillmentOrderLinePick,
    FulfillmentOrderPosition,
    FulfillmentOrderSession,
)
from backend.application.ports import DBGateway
from backend.application.use_cases.auth import AuthService
from backend.application.use_cases.fulfillment_order import FulfillmentOrderService
from backend.infrastructure.persistence.mock_db import DB

from .utils import (
    FulfillmentOrderPickDetail,
    FulfillmentOrderResponse,
    authorize_operator,
    get_fulfillment_order_line,
    get_fulfillment_order_pick_details,
    get_operator_fulfillment_order_session,
)

router: APIRouter = APIRouter(prefix="/picker", tags=["picker"])


db: DBGateway = DB()

auth_service: AuthService = AuthService(db)
fulfillment_order_service: FulfillmentOrderService = FulfillmentOrderService(db)


@router.get("")
async def hello_picker(
    auth_header: str = Header(..., alias="Authorization"),
) -> dict[str, str]:
    authorize_operator(auth_service, auth_header)
    return {"message": "Hello, Picker!"}


@router.get("/fulfillment_orders")
async def list_fulfillment_orders(
    auth_header: str = Header(..., alias="Authorization"),
) -> list[FulfillmentOrderResponse]:
    authorize_operator(auth_service, auth_header)
    return [
        FulfillmentOrderResponse.from_fulfillment_order(
            order, fulfillment_order_service
        )
        for order in fulfillment_order_service.get_ready()
    ]


@router.get("/fulfillment_orders/{fulfillment_order_id}/products")
async def list_fulfillment_order_products(
    fulfillment_order_id: str, auth_header: str = Header(..., alias="Authorization")
) -> list[FulfillmentOrderLine]:
    authorize_operator(auth_service, auth_header)
    return fulfillment_order_service.get_lines(fulfillment_order_id)


@router.get("/fulfillment_orders/{fulfillment_order_id_list}/positions")
async def list_fulfillment_order_positions(
    fulfillment_order_id_list: str,
    auth_header: str = Header(..., alias="Authorization"),
) -> list[FulfillmentOrderPosition]:
    authorize_operator(auth_service, auth_header)
    return fulfillment_order_service.get_products_by_positions_list(
        fulfillment_order_id_list.split(",")
    )


@router.get("/fulfillment_orders/{fulfillment_order_id}/pick")
async def list_fulfillment_order_picks(
    fulfillment_order_id: str, auth_header: str = Header(..., alias="Authorization")
) -> list[FulfillmentOrderPickDetail]:
    authorize_operator(auth_service, auth_header)
    return get_fulfillment_order_pick_details(
        fulfillment_order_service, fulfillment_order_id
    )


@router.put("/assign/{fulfillment_order_id}")
async def assign_fulfillment_order(
    fulfillment_order_id: str, auth_header: str = Header(..., alias="Authorization")
) -> FulfillmentOrderResponse:
    auth_payload: AuthPayload = authorize_operator(auth_service, auth_header)
    assert auth_payload.auth_user.type == AuthUserType.OPERATOR
    operator: str = auth_payload.auth_user.username
    fulfillment_order_service.assign(fulfillment_order_id, operator)
    return FulfillmentOrderResponse.from_fulfillment_order(
        fulfillment_order_service.get(fulfillment_order_id),
        fulfillment_order_service,
    )


@router.put("/unassign/{fulfillment_order_id}")
async def unassign_fulfillment_order(
    fulfillment_order_id: str, auth_header: str = Header(..., alias="Authorization")
) -> FulfillmentOrderResponse:
    auth_payload: AuthPayload = authorize_operator(auth_service, auth_header)
    assert auth_payload.auth_user.type == AuthUserType.OPERATOR
    operator: str = auth_payload.auth_user.username
    fulfillment_order_service.unassign(fulfillment_order_id, operator)
    return FulfillmentOrderResponse.from_fulfillment_order(
        fulfillment_order_service.get(fulfillment_order_id),
        fulfillment_order_service,
    )


class PickRequest(BaseModel):
    position_code: str
    fulfillment_order_id: str
    qty: int
    serial_numbers: list[str] = []


@router.post("/pick")
async def create_pick(
    payload: PickRequest, auth_header: str = Header(..., alias="Authorization")
) -> FulfillmentOrderPickDetail:
    auth_payload: AuthPayload = authorize_operator(auth_service, auth_header)
    assert auth_payload.auth_user.type == AuthUserType.OPERATOR
    if payload.qty <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="qty must be > 0"
        )
    if any(serial_number.strip() == "" for serial_number in payload.serial_numbers):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="serial_numbers cannot contain empty values",
        )
    if len(set(payload.serial_numbers)) != len(payload.serial_numbers):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="serial_numbers cannot contain duplicates",
        )

    try:
        session: FulfillmentOrderSession = get_operator_fulfillment_order_session(
            fulfillment_order_service,
            payload.fulfillment_order_id,
            auth_payload.auth_user.username,
        )
        line: FulfillmentOrderLine = get_fulfillment_order_line(
            fulfillment_order_service,
            payload.fulfillment_order_id,
            payload.position_code,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)
        ) from exc
    if line.requires_serial_tracking and len(payload.serial_numbers) != payload.qty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="serial_numbers count must match qty for serial-tracked products",
        )
    if not line.requires_serial_tracking and len(payload.serial_numbers) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="serial_numbers are allowed only for serial-tracked products",
        )

    pick: FulfillmentOrderLinePick = fulfillment_order_service.new_pick(
        fulfillment_order_session_id=session.id,
        fulfillment_order_line_id=line.id,
        quantity_picked=payload.qty,
        serial_numbers=payload.serial_numbers,
    )
    return FulfillmentOrderPickDetail(
        operator_id=session.operator_id,
        fulfillment_order_id=line.fulfillment_order_id,
        sku=line.sku,
        position_code=line.position_code,
        quantity_picked=pick.quantity_picked,
        serial_numbers=pick.serial_numbers,
        picked_at=pick.picked_at,
    )
