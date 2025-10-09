from dataclasses import dataclass

from ..utils.jwt_utils import decode_jwt, encode_jwt

USERS: dict[str, dict] = {
    "bacchilu@gmail.com": {"pwd": "bacchilu", "name": "Luca Bacchi"},
    "luca@life365.eu": {"pwd": "luca", "name": "Bacchi Luca"},
}


@dataclass(frozen=True)
class AuthUser:
    username: str
    name: str


@dataclass(frozen=True)
class AuthPayload:
    access_token: str
    user: AuthUser


def check_credentials(username: str, password: str) -> AuthPayload | None:
    user_data = USERS.get(username)
    if user_data is not None and user_data.get("pwd") == password:
        token = encode_jwt({"username": username})
        return AuthPayload(
            access_token=token, user=AuthUser(username=username, name=user_data["name"])
        )
    return None


def check_token(token: str) -> AuthPayload:
    payload = decode_jwt(token)
    username = payload["username"]
    user_data = USERS.get(username)
    if user_data is None:
        raise KeyError(f"Unknown user '{username}'")
    return AuthPayload(
        access_token=token, user=AuthUser(username=username, name=user_data["name"])
    )
