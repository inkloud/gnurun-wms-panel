__all__ = ["DB"]

from backend.application.ports.data_gateway import (
    DBGateway,
    FulfillmentOrderAssignmentGateway,
    FulfillmentOrderGateway,
    FulfillmentPickGateway,
    UserGateway,
)

from .fulfillment_assignment_gateway import MockFulfillmentOrderAssignmentGateway
from .fulfillment_order_gateway import MockFulfillmentOrderGateway
from .fulfillment_pick_gateway import MockFulfillmentPickGateway
from .users_gateway import MockUserGateway


class DB(DBGateway):
    def __init__(self) -> None:
        self.user: UserGateway = MockUserGateway()
        self.fulfillment_order: FulfillmentOrderGateway = MockFulfillmentOrderGateway()
        self.fulfillment_assignment: FulfillmentOrderAssignmentGateway = (
            MockFulfillmentOrderAssignmentGateway()
        )
        self.fulfillment_pick: FulfillmentPickGateway = MockFulfillmentPickGateway()
