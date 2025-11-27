__all__ = ["FULFILLMENT_ORDERS", "generate_products"]

import random
from datetime import datetime, timedelta
from functools import lru_cache

from ..types import FulfillmentOrderProductRow, FulfillmentOrderRow
from .users import USERS

_OPERATOR_USERNAMES = [
    username for username, user in USERS.items() if user["type"] == "OPERATOR"
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
                id=f"FO-{base_id + i:04d}",
                date=_random_date_within_last_week(now),
                assigned_to=_random_assigned_users(),
            )
        )
    return orders


FULFILLMENT_ORDERS: list[FulfillmentOrderRow] = _generate_fulfillment_orders()


@lru_cache(maxsize=None)
def generate_products(fulfillment_order_id: int) -> list[FulfillmentOrderProductRow]:
    total = random.randint(1, 25)
    products: list[FulfillmentOrderProductRow] = []
    for idx in range(total):
        products.append(
            FulfillmentOrderProductRow(
                id=idx + 1,
                sku=f"SKU-{fulfillment_order_id}-{idx + 1:03d}",
                name=f"Product {idx + 1}",
                quantity=random.randint(1, 5),
                fulfillment_order_id=fulfillment_order_id,
            )
        )
    return products
