__all__ = ["USERS"]

from ..types import User, UserType, Warehouse

_WAREHOUSE = Warehouse(id=1, name="Gnu000 Test")

USERS: dict[str, User] = {
    "bacchilu@gmail.com": User(
        username="bacchilu@gmail.com",
        pwd="bacchilu",
        name="Luca Bacchi",
        type=UserType.MANAGER,
        warehouse=_WAREHOUSE,
    ),
    "alice.porter@gnurun.example": User(
        username="alice.porter@gnurun.example",
        pwd="alice.porter",
        name="Alice Porter",
        type=UserType.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
    "marco.jimenez@gnurun.example": User(
        username="marco.jimenez@gnurun.example",
        pwd="marco.jimenez",
        name="Marco Jimenez",
        type=UserType.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
    "priya.desai@gnurun.example": User(
        username="priya.desai@gnurun.example",
        pwd="priya.desai",
        name="Priya Desai",
        type=UserType.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
    "ethan.wright@gnurun.example": User(
        username="ethan.wright@gnurun.example",
        pwd="ethan.wright",
        name="Ethan Wright",
        type=UserType.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
    "sofia.conti@gnurun.example": User(
        username="sofia.conti@gnurun.example",
        pwd="sofia.conti",
        name="Sofia Conti",
        type=UserType.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
    "luca@life365.eu": User(
        username="luca@life365.eu",
        pwd="luca",
        name="Luca Bacchi",
        type=UserType.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
}
