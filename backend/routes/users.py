__all__ = ["router"]


from fastapi import APIRouter, Header, HTTPException, status

from backend.domain.entities.auth import AuthPayload, AuthUserType
from backend.domain.entities.users import User
from backend.infrastructure.persistence.mock_db import DB
from backend.services.auth import AuthService
from backend.services.interfaces import DBGateway
from backend.services.users import UsersService
from .utils import get_token_from_header

router: APIRouter = APIRouter(prefix="/users", tags=["users"])


db: DBGateway = DB()

users_service: UsersService = UsersService(db)
auth_service: AuthService = AuthService(db)


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
