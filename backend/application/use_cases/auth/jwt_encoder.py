__all__ = ["encode", "decode"]

from backend.application.entities.auth import AuthUser, AuthUserType
from .jwt_utils import decode_jwt, encode_jwt


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
