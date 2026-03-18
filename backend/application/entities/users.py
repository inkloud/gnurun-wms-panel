__all__ = ["UserType", "Warehouse", "User"]

from dataclasses import dataclass
from enum import Enum


class UserType(Enum):
    MANAGER = "MANAGER"
    OPERATOR = "OPERATOR"


@dataclass(frozen=True)
class Warehouse:
    id: int
    name: str


@dataclass(frozen=True)
class User:
    username: str
    name: str
    pwd: str
    type: UserType
    warehouse: Warehouse
