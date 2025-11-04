__all__ = ["router"]

from fastapi import APIRouter, Header, HTTPException, status

from ..data_gateway import mock_db
from ..data_gateway.types import FulfillmentOrder
from ..services.auth import AuthService, AuthUserType
from ..services.picker import PickerService
from ..utils import get_token_from_header

router = APIRouter(prefix="/picker", tags=["picker"])


auth_service = AuthService(mock_db.DB())
picker_service = PickerService(mock_db.DB())


def _authorize_operator(auth_header: str):
    token = get_token_from_header(auth_header)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer scheme",
        )
    try:
        auth_payload = auth_service.check_token(token)
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
