__all__ = ["router"]

from fastapi import APIRouter, Header, HTTPException, status

from ..data_mapper.mock_db import DB
from ..domain.entities.auth import AuthPayload, AuthUserType
from ..domain.entities.fulfillment_order import (
    FulfillmentOrder,
    FulfillmentOrderLine,
    FulfillmentOrderPosition,
)
from ..services.auth import AuthService
from ..services.fulfillment_order import FulfillmentOrderService
from ..utils import get_token_from_header

router = APIRouter(prefix="/picker", tags=["picker"])


auth_service = AuthService(DB())
fulfillment_order_service = FulfillmentOrderService(DB())


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
) -> list[FulfillmentOrder]:
    _authorize_operator(auth_header)
    return fulfillment_order_service.get_ready()


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
) -> FulfillmentOrder:
    auth_payload: AuthPayload = _authorize_operator(auth_header)
    assert auth_payload.auth_user.type == AuthUserType.OPERATOR
    operator: str = auth_payload.auth_user.username
    return fulfillment_order_service.assign(fulfillment_order_id, operator)


@router.put("/unassign/{fulfillment_order_id}")
async def unassign_fulfillment_order(
    fulfillment_order_id: str, auth_header: str = Header(..., alias="Authorization")
) -> FulfillmentOrder:
    auth_payload: AuthPayload = _authorize_operator(auth_header)
    assert auth_payload.auth_user.type == AuthUserType.OPERATOR
    operator: str = auth_payload.auth_user.username
    return fulfillment_order_service.unassign(fulfillment_order_id, operator)
