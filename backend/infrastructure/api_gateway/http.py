__all__ = ["HTTPAPIGateway"]

import httpx


class HTTPAPIGateway:
    async def get_health(self) -> bool:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get("http://api-server-dev:8000/api/v2/health")
                response.raise_for_status()
                return response.json()["status"] == "ok"
        except (httpx.HTTPError, KeyError):
            return False
