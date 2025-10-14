__all__ = ["UserRow", "DBGateway", "Warehouse"]

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class Warehouse:
    id: int
    name: str


@dataclass(frozen=True)
class UserRow:
    username: str
    name: str
    pwd: str
    warehouse: Warehouse


class DBGateway(Protocol):
    @staticmethod
    def get_user(username: str) -> UserRow | None: ...
