__all__ = ["FULFILLMENT_ORDERS", "FULFILLMENT_ORDERS_PRODUCTS"]

import random
from datetime import datetime, timedelta

from ..types import FulfillmentOrderProductRow, FulfillmentOrderRow, ProductRow
from .products import PRODUCTS
from .users import USERS, UserType

_OPERATOR_USERNAMES = [
    username for username, user in USERS.items() if user.type == UserType.OPERATOR
]


def _random_date_within_last_week(now: datetime) -> datetime:
    seconds_back = random.randint(0, 7 * 24 * 60 * 60)
    return now - timedelta(seconds=seconds_back)


def _random_assigned_users() -> list[str]:
    if random.random() < 0.5:
        return []
    desired = 1 if random.random() < 0.5 else 2
    count = min(desired, len(_OPERATOR_USERNAMES))
    return random.sample(_OPERATOR_USERNAMES, k=count)


def _generate_fulfillment_orders() -> list[FulfillmentOrderRow]:
    now = datetime.now()
    total = random.randint(0, 10)
    base_id = 1001
    orders: list[FulfillmentOrderRow] = []
    for i in range(total):
        orders.append(
            FulfillmentOrderRow(
                id=base_id + i,
                date=_random_date_within_last_week(now),
                assigned_to=_random_assigned_users(),
            )
        )
    return orders


FULFILLMENT_ORDERS: list[FulfillmentOrderRow] = _generate_fulfillment_orders()


def generate_products(fulfillment_order_id: int) -> list[FulfillmentOrderProductRow]:
    picked_products: list[ProductRow] = random.sample(
        PRODUCTS, k=random.randint(1, min(25, len(PRODUCTS)))
    )
    products: list[FulfillmentOrderProductRow] = []
    for idx, picked_product in enumerate(picked_products):
        quantity = random.randint(1, picked_product.get_stock())
        if quantity <= picked_product.where[0].stock:
            products.append(
                FulfillmentOrderProductRow(
                    id=idx + 1,
                    sku=picked_product.sku,
                    name=picked_product.name,
                    quantity=quantity,
                    fulfillment_order_id=fulfillment_order_id,
                    position=picked_product.where[0].position,
                )
            )
        else:
            q = (
                picked_product.where[0].stock,
                quantity - picked_product.where[0].stock,
            )
            products.append(
                FulfillmentOrderProductRow(
                    id=idx + 1,
                    sku=picked_product.sku,
                    name=picked_product.name,
                    quantity=q[0],
                    fulfillment_order_id=fulfillment_order_id,
                    position=picked_product.where[0].position,
                )
            )
            products.append(
                FulfillmentOrderProductRow(
                    id=idx + 1,
                    sku=picked_product.sku,
                    name=picked_product.name,
                    quantity=q[1],
                    fulfillment_order_id=fulfillment_order_id,
                    position=picked_product.where[1].position,
                )
            )
    return products


FULFILLMENT_ORDERS_PRODUCTS: list[FulfillmentOrderProductRow] = []
for o in FULFILLMENT_ORDERS:
    FULFILLMENT_ORDERS_PRODUCTS.extend(generate_products(o.id))
