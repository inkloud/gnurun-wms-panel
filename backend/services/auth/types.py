__all__ = ["AuthUserType", "AuthUser", "AuthPayload"]

from dataclasses import dataclass
from enum import Enum


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
