__all__ = ["router"]

from fastapi import APIRouter, Header, HTTPException, status

from backend.application.ports import DBGateway
from backend.application.use_cases.auth import AuthService
from backend.application.use_cases.stock_products import StockProductService
from backend.infrastructure.persistence.mock_db import DB

from .utils import (
    LogEventRequest,
    ProductHistoryRecordResponse,
    ProductSuggestionResponse,
    SetExtraSpecsRequest,
    SetLocationRequest,
    StockProductResponse,
    StockRTResponse,
    authorize_warehouse,
)

router: APIRouter = APIRouter(prefix="/stock_products", tags=["stock_products"])

db: DBGateway = DB()
auth_service: AuthService = AuthService(db)
stock_product_service: StockProductService = StockProductService(db)


@router.get("/barcode/{barcode}")
async def get_product_by_barcode(
    barcode: str,
    auth_header: str = Header(..., alias="Authorization"),
) -> StockProductResponse:
    authorize_warehouse(auth_service, auth_header)
    pass


@router.get("/product/{product_stock_id}")
async def get_product_by_id(
    product_stock_id: int,
    auth_header: str = Header(..., alias="Authorization"),
) -> StockProductResponse:
    authorize_warehouse(auth_service, auth_header)
    pass


@router.get("/by-place/{location}")
async def get_product_by_place(
    location: str,
    auth_header: str = Header(..., alias="Authorization"),
) -> list[StockProductResponse]:
    authorize_warehouse(auth_service, auth_header)
    pass


@router.get("/product/{product_id}/history")
async def get_product_location_history(
    product_id: int,
    auth_header: str = Header(..., alias="Authorization"),
) -> list[ProductHistoryRecordResponse]:
    authorize_warehouse(auth_service, auth_header)
    pass


@router.get("/product/{product_stock_id}/stock-rt")
async def get_stock_rt(
    product_stock_id: int,
    auth_header: str = Header(..., alias="Authorization"),
) -> StockRTResponse:
    authorize_warehouse(auth_service, auth_header)
    pass


@router.put("/product/{product_stock_id}/location")
async def set_product_location(
    product_stock_id: int,
    payload: SetLocationRequest,
    auth_header: str = Header(..., alias="Authorization"),
) -> StockProductResponse:
    authorize_warehouse(auth_service, auth_header)
    pass


@router.put("/product/{product_id}/extra-specs")
async def set_product_extra_specs(
    product_id: int,
    payload: SetExtraSpecsRequest,
    auth_header: str = Header(..., alias="Authorization"),
) -> StockProductResponse:
    authorize_warehouse(auth_service, auth_header)
    pass


@router.get("/search")
async def search_product_suggestions(
    s: str,
    auth_header: str = Header(..., alias="Authorization"),
) -> list[ProductSuggestionResponse]:
    authorize_warehouse(auth_service, auth_header)
    pass


@router.post("/log")
async def log_event(
    payload: LogEventRequest,
    auth_header: str = Header(..., alias="Authorization"),
) -> dict[str, str]:
    authorize_warehouse(auth_service, auth_header)
    pass
