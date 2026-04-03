from backend.application.entities.users import User, UserType, Warehouse

from .types import UserRow


def to_user_row(user_data: UserRow) -> User:
    return User(
        username=user_data.username,
        name=user_data.name,
        pwd=user_data.pwd,
        type=UserType(user_data.type.value),
        warehouse=Warehouse(id=user_data.warehouse.id, name=user_data.warehouse.name),
    )
