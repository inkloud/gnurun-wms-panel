__all__ = ["router"]


from fastapi import APIRouter
import httpx

router: APIRouter = APIRouter(prefix="", tags=["root"])


@router.get("/")
async def root():
    api_server_status: str = "down"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://api-server-dev:8000/api/v2/health")
            response.raise_for_status()
            api_server_status = response.json()["status"]
    except (httpx.HTTPError, KeyError):
        api_server_status = "down"

    return {"status": "ok", "api-server": api_server_status}
