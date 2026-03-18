__all__ = ["router"]


from fastapi import APIRouter

router: APIRouter = APIRouter(prefix="", tags=["root"])


@router.get("/")
async def root():
    return {"Hello": "World"}
