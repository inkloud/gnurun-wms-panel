__all__ = ["router"]


from fastapi import APIRouter, Header, HTTPException, status

from ..data_gateway.mock_db import DB
from ..services.auth import AuthService
from ..services.auth.types import AuthPayload, AuthUserType
from ..services.users import UsersService
from ..services.users.types import User
from ..utils import get_token_from_header

router = APIRouter(prefix="/users", tags=["users"])


users_service = UsersService(DB())
auth_service = AuthService(DB())


@router.get("")
async def get_operators(
    auth_header: str = Header(..., alias="Authorization"),
) -> list[User]:
    token: str | None = get_token_from_header(auth_header)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer scheme",
        )
    try:
        auth_payload: AuthPayload = auth_service.check_token(token)
        assert auth_payload.auth_user.type == AuthUserType.MANAGER
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc
    return users_service.get_operators(auth_payload.auth_user.username)
