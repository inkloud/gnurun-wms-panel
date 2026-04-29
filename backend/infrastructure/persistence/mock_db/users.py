__all__ = ["USERS"]

import json
from pathlib import Path

from .types import UserRow, UserTypeRow
from .warehouses import WAREHOUSES

_USERS_PATH = Path(__file__).with_name("raw_data") / "users.json"


def _load_users() -> dict[str, UserRow]:
    payload = json.loads(_USERS_PATH.read_text(encoding="utf-8"))
    users: dict[str, UserRow] = {}

    for raw_user in payload:
        username = raw_user["username"]
        warehouse_id = raw_user["warehouses_id"]
        users[username] = UserRow(
            username=username,
            pwd=raw_user["pwd"],
            name=raw_user["name"],
            type=UserTypeRow(raw_user["type"]),
            warehouse=WAREHOUSES[warehouse_id],
        )

    return users


USERS: dict[str, UserRow] = _load_users()
