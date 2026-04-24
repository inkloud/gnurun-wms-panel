__all__ = ["router"]

from fastapi import APIRouter

from backend.application.use_cases.health import APIHealthService
from backend.infrastructure.api_gateway import HTTPAPIGateway

router: APIRouter = APIRouter(prefix="", tags=["root"])

health_service: APIHealthService = APIHealthService(HTTPAPIGateway())


@router.get("/")
async def root() -> dict[str, str]:
    api_server_status: bool = await health_service.get_health()
    return {"status": "ok", "api-server": "ok" if api_server_status else "down"}
