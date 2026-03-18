__all__ = ["router"]


from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel

from backend.application.entities.auth import AuthPayload, AuthUserType
from backend.infrastructure.persistence.mock_db import DB
from backend.application.ports import DBGateway
from backend.application.use_cases.auth import AuthService
from backend.application.use_cases.users import UsersService
from .utils import get_token_from_header

router: APIRouter = APIRouter(prefix="/auth", tags=["auth"])


db: DBGateway = DB()

auth_service: AuthService = AuthService(db)
users_service: UsersService = UsersService(db)


class AuthRequest(BaseModel):
    username: str
    password: str


def login(payload: AuthRequest) -> AuthPayload:
    if (
        data := auth_service.check_credentials(payload.username, payload.password)
    ) is not None:
        return data
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
    )


@router.post("")
async def authenticate(payload: AuthRequest) -> AuthPayload:
    return login(payload)


@router.get("")
async def verify_authentication(
    auth_header: str = Header(..., alias="Authorization"),
) -> AuthPayload:
    token: str | None = get_token_from_header(auth_header)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer scheme",
        )
    try:
        return auth_service.check_token(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc


@router.get("/as/{username}")
async def auth_as(
    username: str, auth_header: str = Header(..., alias="Authorization")
) -> AuthPayload:
    token = get_token_from_header(auth_header)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer scheme",
        )
    try:
        auth_payload = auth_service.check_token(token)
        assert auth_payload.auth_user.type == AuthUserType.MANAGER
        operators = users_service.get_operators(auth_payload.auth_user.username)
        o = [o for o in operators if o.username == username]
        assert len(o) == 1
        payload = AuthRequest(username=o[0].username, password=o[0].pwd)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc
    return login(payload)
