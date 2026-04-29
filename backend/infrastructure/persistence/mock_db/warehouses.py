__all__ = ["WAREHOUSES"]

import json
from pathlib import Path

from .types import WarehouseRow

_WAREHOUSES_PATH = Path(__file__).with_name("raw_data") / "warehouses.json"


def _load_warehouses() -> dict[int, WarehouseRow]:
    payload = json.loads(_WAREHOUSES_PATH.read_text(encoding="utf-8"))
    return {
        raw_warehouse["id"]: WarehouseRow(
            id=raw_warehouse["id"],
            name=raw_warehouse["name"],
        )
        for raw_warehouse in payload
    }


WAREHOUSES: dict[int, WarehouseRow] = _load_warehouses()
