__all__ = ["AuthService"]

from ...domain.entities.auth import AuthPayload, AuthUser, AuthUserType
from ...domain.entities.users import User
from ...domain.interfaces.data_gateway import DBGateway
from .utils import decode, encode


class AuthService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def check_credentials(self, username: str, password: str) -> AuthPayload | None:
        user_data: User | None = self.data_mapper.user.get_user(username)
        if user_data is not None and user_data.pwd == password:
            auth_user = AuthUser(
                username=username,
                name=user_data.name,
                warehouse=user_data.warehouse.name,
                type=AuthUserType(user_data.type.value),
            )
            token: str = encode(auth_user)
            return AuthPayload(access_token=token, auth_user=auth_user)
        return None

    def check_token(self, token: str) -> AuthPayload:
        auth_user: AuthUser = decode(token)
        user_data: User | None = self.data_mapper.user.get_user(auth_user.username)
        if user_data is None:
            raise KeyError(f"Unknown user '{auth_user.username}'")
        fresh_auth_user = AuthUser(
            username=auth_user.username,
            name=user_data.name,
            warehouse=user_data.warehouse.name,
            type=AuthUserType(user_data.type.value),
        )
        return AuthPayload(access_token=token, auth_user=fresh_auth_user)
