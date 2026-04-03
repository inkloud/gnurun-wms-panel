from backend.application.entities.users import User, UserType
from backend.application.ports.data_gateway import UserGateway

from .mappers import to_user_row
from .types import UserRow, UserTypeRow
from .users import USERS


class MockUserGateway(UserGateway):
    @staticmethod
    def get_user(username: str) -> User | None:
        user_data: UserRow | None = USERS.get(username)
        return None if user_data is None else to_user_row(user_data)

    @staticmethod
    def get_operators(username: str) -> list[User]:
        manager_user: User | None = MockUserGateway.get_user(username)
        if manager_user is None:
            raise KeyError(f"Unknown manager '{username}'")
        assert manager_user.type == UserType.MANAGER
        warehouse_id: int = manager_user.warehouse.id

        return [
            to_user_row(user_data)
            for user_data in USERS.values()
            if user_data.type == UserTypeRow.OPERATOR
            and user_data.warehouse.id == warehouse_id
        ]
