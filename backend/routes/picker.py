__all__ = ["router"]

from fastapi import APIRouter, Header, HTTPException, status

from ..data_gateway import mock_db
from ..services.auth import AuthService
from ..services.auth.types import AuthPayload, AuthUserType
from ..services.picker import PickerService
from ..services.picker.types import FulfillmentOrder
from ..utils import get_token_from_header

router = APIRouter(prefix="/picker", tags=["picker"])


auth_service = AuthService(mock_db.DB())
picker_service = PickerService(mock_db.DB())


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
    return picker_service.get_fulfillment_orders()


@router.put("/assign/{fulfillment_order_id}")
async def assign_fulfillment_order(
    fulfillment_order_id: str, auth_header: str = Header(..., alias="Authorization")
) -> FulfillmentOrder:
    auth_payload: AuthPayload = _authorize_operator(auth_header)
    assert auth_payload.auth_user.type == AuthUserType.OPERATOR
    operator: str = auth_payload.auth_user.username
    return picker_service.assign_fulfillment_orders(fulfillment_order_id, operator)


@router.put("/unassign/{fulfillment_order_id}")
async def unassign_fulfillment_order(
    fulfillment_order_id: str, auth_header: str = Header(..., alias="Authorization")
) -> FulfillmentOrder:
    auth_payload: AuthPayload = _authorize_operator(auth_header)
    assert auth_payload.auth_user.type == AuthUserType.OPERATOR
    operator: str = auth_payload.auth_user.username
    return picker_service.unassign_fulfillment_orders(fulfillment_order_id, operator)
