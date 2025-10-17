__all__ = ["UsersService"]


from ..data_gateway.types import DBGateway


class UsersService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_users(self) -> list[int]:
        return [101, 102, 103, 104, 105]
