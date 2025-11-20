__all__ = ["FulfillmentOrderService"]

from ...data_gateway.types import DBGateway, FulfillmentOrderRow
from .types import FulfillmentOrder


def _to_fulfillment_order(order: FulfillmentOrderRow) -> FulfillmentOrder:
    return FulfillmentOrder(
        id=order.id, date=order.date, assigned_to=list(order.assigned_to)
    )


class FulfillmentOrderService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_fulfillment_orders(self) -> list[FulfillmentOrder]:
        return [
            _to_fulfillment_order(order)
            for order in self.data_mapper.fulfillment.get_fulfillment_orders()
        ]

    def assign_fulfillment_orders(self, id: str, operator: str) -> FulfillmentOrder:
        updated: FulfillmentOrderRow = self.data_mapper.fulfillment.assign(id, operator)
        return _to_fulfillment_order(updated)

    def unassign_fulfillment_orders(self, id: str, operator: str) -> FulfillmentOrder:
        updated: FulfillmentOrderRow = self.data_mapper.fulfillment.unassign(
            id, operator
        )
        return _to_fulfillment_order(updated)
