__all__ = ["UsersService"]


from ..data_gateway.types import DBGateway, UserRow


class UsersService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_operators(self, username: str) -> list[UserRow]:
        return self.data_mapper.get_operators(username)
