__all__ = ["router"]


from fastapi import APIRouter, Header, HTTPException, status

from ..data_gateway import mock_db
from ..services.users import UsersService
from ..utils import get_token_from_header

router = APIRouter(prefix="/users", tags=["users"])


users_service = UsersService(mock_db.DB())


@router.get("")
async def get_users(
    auth_header: str = Header(..., alias="Authorization"),
):
    token = get_token_from_header(auth_header)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer scheme",
        )
    return users_service.get_users()
