__all__ = ["check_credentials", "check_token"]


from dataclasses import dataclass

from ..data_gateway import DataAccess, UserRow
from ..utils.jwt_utils import decode_jwt, encode_jwt


@dataclass(frozen=True)
class AuthUser:
    username: str
    name: str

    def to_dict(self) -> dict[str, str]:
        return {"username": self.username, "name": self.name}


@dataclass(frozen=True)
class AuthPayload:
    access_token: str
    auth_user: AuthUser


def encode(auth_user: AuthUser) -> str:
    return encode_jwt(auth_user.to_dict())


def decode(token: str) -> AuthUser:
    payload = decode_jwt(token)
    return AuthUser(username=payload["username"], name=payload["name"])


def check_credentials(username: str, password: str) -> AuthPayload | None:
    user_data: UserRow | None = DataAccess.get_user(username)
    if user_data is not None and user_data.pwd == password:
        token = encode(AuthUser(username=username, name=user_data.name))
        return AuthPayload(
            access_token=token,
            auth_user=AuthUser(username=username, name=user_data.name),
        )
    return None


def check_token(token: str) -> AuthPayload:
    auth_user = decode(token)
    user_data: UserRow | None = DataAccess.get_user(auth_user.username)
    if user_data is None:
        raise KeyError(f"Unknown user '{auth_user.username}'")
    return AuthPayload(
        access_token=token,
        auth_user=AuthUser(username=auth_user.username, name=user_data.name),
    )
