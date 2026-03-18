__all__ = ["UsersService"]

from backend.application.entities.users import User
from backend.application.ports.data_gateway import DBGateway


class UsersService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_operators(self, username: str) -> list[User]:
        return self.data_mapper.user.get_operators(username)
