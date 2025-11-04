__all__ = ["PickerService"]

from ..data_gateway.types import DBGateway, FulfillmentOrder


class PickerService:
    def __init__(self, data_mapper: DBGateway):
        self.data_mapper = data_mapper

    def get_fulfillment_orders(self) -> list[FulfillmentOrder]:
        return self.data_mapper.get_fulfillment_orders()
