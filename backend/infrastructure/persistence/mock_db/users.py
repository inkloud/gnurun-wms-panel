__all__ = ["USERS"]

import json
from pathlib import Path

from .types import UserRow, UserTypeRow, WarehouseRow

_USERS_PATH = Path(__file__).with_name("raw_data") / "users.json"


def _load_users() -> dict[str, UserRow]:
    payload = json.loads(_USERS_PATH.read_text(encoding="utf-8"))
    raw_warehouse = payload["warehouse"]
    warehouse = WarehouseRow(id=raw_warehouse["id"], name=raw_warehouse["name"])
    users: dict[str, UserRow] = {}

    for raw_user in payload["users"]:
        username = raw_user["username"]
        users[username] = UserRow(
            username=username,
            pwd=raw_user["pwd"],
            name=raw_user["name"],
            type=UserTypeRow(raw_user["type"]),
            warehouse=warehouse,
        )

    return users


USERS: dict[str, UserRow] = _load_users()
