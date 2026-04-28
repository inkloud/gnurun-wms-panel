__all__ = ["encode", "decode"]

from backend.application.entities.auth import AuthUser, AuthUserType, Warehouse
from .jwt_utils import decode_jwt, encode_jwt


def encode(auth_user: AuthUser) -> str:
    return encode_jwt(auth_user.to_dict())


def decode(token: str) -> AuthUser:
    payload = decode_jwt(token)
    raw_warehouse = payload["warehouse"]
    if isinstance(raw_warehouse, dict):
        warehouse_id = raw_warehouse["id"]
        warehouse_name = raw_warehouse["name"]
    else:
        raise ValueError(f"Unexpected warehouse format in JWT: {raw_warehouse!r}")
    return AuthUser(
        username=payload["username"],
        name=payload["name"],
        warehouse=Warehouse(id=warehouse_id, name=warehouse_name),
        type=AuthUserType(payload["type"]),
    )
