__all__ = ["USERS"]

from .types import UserRow, UserTypeRow, WarehouseRow

_WAREHOUSE = WarehouseRow(id=1, name="Gnu000 Test")

USERS: dict[str, UserRow] = {
    "bacchilu@gmail.com": UserRow(
        username="bacchilu@gmail.com",
        pwd="bacchilu",
        name="Luca Bacchi",
        type=UserTypeRow.MANAGER,
        warehouse=_WAREHOUSE,
    ),
    "alice.porter@gnurun.example": UserRow(
        username="alice.porter@gnurun.example",
        pwd="alice.porter",
        name="Alice Porter",
        type=UserTypeRow.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
    "marco.jimenez@gnurun.example": UserRow(
        username="marco.jimenez@gnurun.example",
        pwd="marco.jimenez",
        name="Marco Jimenez",
        type=UserTypeRow.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
    "priya.desai@gnurun.example": UserRow(
        username="priya.desai@gnurun.example",
        pwd="priya.desai",
        name="Priya Desai",
        type=UserTypeRow.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
    "ethan.wright@gnurun.example": UserRow(
        username="ethan.wright@gnurun.example",
        pwd="ethan.wright",
        name="Ethan Wright",
        type=UserTypeRow.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
    "sofia.conti@gnurun.example": UserRow(
        username="sofia.conti@gnurun.example",
        pwd="sofia.conti",
        name="Sofia Conti",
        type=UserTypeRow.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
    "luca@life365.eu": UserRow(
        username="luca@life365.eu",
        pwd="luca",
        name="Luca Bacchi",
        type=UserTypeRow.OPERATOR,
        warehouse=_WAREHOUSE,
    ),
}
