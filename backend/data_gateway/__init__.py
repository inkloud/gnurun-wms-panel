__all__ = ["DataAccess", "UserRow"]


from .mock_db import DB
from .types import DBGateway, UserRow

DataAccess: DBGateway = DB()
