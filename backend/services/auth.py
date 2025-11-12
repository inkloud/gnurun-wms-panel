__all__ = ["AuthService", "AuthUserType", "AuthPayload"]


from dataclasses import dataclass
from enum import Enum

from ..data_gateway.types import DBGateway
from ..utils.jwt_utils import decode_jwt, encode_jwt


class AuthUserType(Enum):
    MANAGER = "MANAGER"
    OPERATOR = "OPERATOR"


@dataclass(frozen=True)
class AuthUser:
    username: str
    name: str
    warehouse: str
    type: AuthUserType

    def to_dict(self) -> dict[str, str]:
        return {
            "username": self.username,
            "name": self.name,
            "warehouse": self.warehouse,
            "type": self.type.value,
        }


@dataclass(frozen=True)
class AuthPayload:
    access_token: str
    auth_user: AuthUser


def encode(auth_user: AuthUser) -> str:
    return encode_jwt(auth_user.to_dict())


def decode(token: str) -> AuthUser:
    payload = decode_jwt(token)
    return AuthUser(
        username=payload["username"],
        name=payload["name"],
        warehouse=payload["warehouse"],
        type=AuthUserType(payload["type"]),
    )


class AuthService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def check_credentials(self, username: str, password: str) -> AuthPayload | None:
        user_data = self.data_mapper.user.get_user(username)
        if user_data is not None and user_data.pwd == password:
            token = encode(
                AuthUser(
                    username=username,
                    name=user_data.name,
                    warehouse=user_data.warehouse.name,
                    type=AuthUserType(user_data.type.value),
                )
            )
            return AuthPayload(
                access_token=token,
                auth_user=AuthUser(
                    username=username,
                    name=user_data.name,
                    warehouse=user_data.warehouse.name,
                    type=AuthUserType(user_data.type.value),
                ),
            )
        return None

    def check_token(self, token: str) -> AuthPayload:
        auth_user = decode(token)
        user_data = self.data_mapper.user.get_user(auth_user.username)
        if user_data is None:
            raise KeyError(f"Unknown user '{auth_user.username}'")
        return AuthPayload(
            access_token=token,
            auth_user=AuthUser(
                username=auth_user.username,
                name=user_data.name,
                warehouse=user_data.warehouse.name,
                type=AuthUserType(user_data.type.value),
            ),
        )
