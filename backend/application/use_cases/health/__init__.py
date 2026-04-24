__all__ = ["APIHealthService"]

from backend.application.ports.api_gateway import APIGateway


class APIHealthService:
    def __init__(self, api_gateway: APIGateway):
        self.api_gateway = api_gateway

    async def get_health(self) -> bool:
        return await self.api_gateway.get_health()
