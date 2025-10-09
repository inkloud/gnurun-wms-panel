__all__ = ["UserRow", "DBGateway"]

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class UserRow:
    username: str
    name: str
    pwd: str


class DBGateway(Protocol):
    @staticmethod
    def get_user(username: str) -> UserRow | None: ...
