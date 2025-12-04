__all__ = ["order_by_position"]


from ...domain.entities.fulfillment_order import FulfillmentOrderPosition


def order_by_position(
    items: list[FulfillmentOrderPosition],
) -> list[FulfillmentOrderPosition]:
    return sorted(items, key=lambda item: item.position)
