__all__ = ["router"]


from fastapi import APIRouter

router = APIRouter(prefix="", tags=["root"])


@router.get("/")
async def root():
    return {"Hello": "World"}
