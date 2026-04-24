__all__ = ["APIGateway"]

from typing import Protocol


class APIGateway(Protocol):
    async def get_health(self) -> bool: ...
