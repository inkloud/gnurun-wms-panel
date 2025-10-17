__all__ = ["router"]


from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel

from ..data_gateway import mock_db
from ..services.auth import AuthService
from ..utils import get_token_from_header

router = APIRouter(prefix="/auth", tags=["auth"])

auth_service = AuthService(mock_db.DB())


class AuthRequest(BaseModel):
    username: str
    password: str


@router.post("")
async def authenticate(payload: AuthRequest):
    if (
        data := auth_service.check_credentials(payload.username, payload.password)
    ) is not None:
        return data
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
    )


@router.get("")
async def verify_authentication(
    auth_header: str = Header(..., alias="Authorization"),
):
    token = get_token_from_header(auth_header)
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
