__all__ = [
    "StockProductResponse",
    "ProductSuggestionResponse",
    "ProductHistoryRecordResponse",
    "StockRTResponse",
    "LogEventRequest",
    "SetLocationRequest",
    "SetExtraSpecsRequest",
    "authorize_warehouse",
]

from dataclasses import dataclass

from fastapi import HTTPException, status
from pydantic import BaseModel

from backend.application.entities.auth import AuthPayload
from backend.application.use_cases.auth import AuthService

from ..utils import get_token_from_header


@dataclass(frozen=True)
class StockProductResponse:
    id: int
    product_stock_id: int
    code_simple: str
    barcode: str
    location: str | None
    stock: int


@dataclass(frozen=True)
class ProductSuggestionResponse:
    id: int
    code_simple: str


@dataclass(frozen=True)
class ProductHistoryRecordResponse:
    timestamp: str
    warehouse_place: str


@dataclass(frozen=True)
class StockRTResponse:
    stock: int
    code_simple: str
    product_stock_id: int


class SetLocationRequest(BaseModel):
    location: str


class SetExtraSpecsRequest(BaseModel):
    extra_specs: dict


class LogEventRequest(BaseModel):
    event: str
    value_text: str
    value_int1: int
    value_int2: int
    value_raw: dict
    expire_date: str | None = None


def authorize_warehouse(auth_service: AuthService, auth_header: str) -> AuthPayload:
    token: str | None = get_token_from_header(auth_header)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer scheme",
        )
    try:
        auth_payload: AuthPayload = auth_service.check_token(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc
    return auth_payload
