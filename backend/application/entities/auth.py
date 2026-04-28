__all__ = ["AuthUserType", "Warehouse", "AuthUser", "AuthPayload"]

from dataclasses import dataclass
from enum import Enum


class AuthUserType(Enum):
    MANAGER = "MANAGER"
    OPERATOR = "OPERATOR"


@dataclass(frozen=True)
class Warehouse:
    id: int
    name: str

    def to_dict(self) -> dict[str, str | int]:
        return {"id": self.id, "name": self.name}


@dataclass(frozen=True)
class AuthUser:
    username: str
    name: str
    warehouse: Warehouse
    type: AuthUserType

    def to_dict(self) -> dict[str, str | dict[str, str | int]]:
        return {
            "username": self.username,
            "name": self.name,
            "warehouse": self.warehouse.to_dict(),
            "type": self.type.value,
        }


@dataclass(frozen=True)
class AuthPayload:
    access_token: str
    auth_user: AuthUser
