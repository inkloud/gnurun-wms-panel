__all__ = ["UsersService", "User"]

from ...data_gateway.types import DBGateway, UserRow
from .types import User, UserType, Warehouse


class UsersService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_operators(self, username: str) -> list[User]:
        rows: list[UserRow] = self.data_mapper.user.get_operators(username)
        return [
            User(
                username=row.username,
                name=row.name,
                pwd=row.pwd,
                type=UserType(row.type.value),
                warehouse=Warehouse(id=row.warehouse.id, name=row.warehouse.name),
            )
            for row in rows
        ]
