__all__ = [
    "FULFILLMENT_ORDERS",
    "FULFILLMENT_ORDERS_PRODUCTS",
    "FULFILLMENT_ORDER_SESSIONS",
]

import random
from datetime import datetime, timedelta

from .products import PRODUCTS
from .types import (
    FulfillmentOrderProductRow,
    FulfillmentOrderRow,
    FulfillmentOrderSessionRow,
    ProductRow,
)
from .users import USERS, UserTypeRow

_OPERATOR_USERNAMES = [
    username for username, user in USERS.items() if user.type == UserTypeRow.OPERATOR
]


def _random_date_within_last_week(now: datetime) -> datetime:
    seconds_back = random.randint(0, 7 * 24 * 60 * 60)
    return now - timedelta(seconds=seconds_back)


def _random_sessions(
    fulfillment_order_id: int, created_at: datetime
) -> list[FulfillmentOrderSessionRow]:
    if random.random() < 0.5:
        return []
    desired = 1 if random.random() < 0.5 else 2
    count = min(desired, len(_OPERATOR_USERNAMES))
    operator_ids = random.sample(_OPERATOR_USERNAMES, k=count)
    return [
        FulfillmentOrderSessionRow(
            operator_id=operator_id,
            fulfillment_order_id=fulfillment_order_id,
            started_at=created_at,
        )
        for operator_id in operator_ids
    ]


def _generate_fulfillment_orders() -> tuple[
    list[FulfillmentOrderRow], list[FulfillmentOrderSessionRow]
]:
    now = datetime.now()
    total = random.randint(0, 10)
    base_id = 1001
    orders: list[FulfillmentOrderRow] = []
    sessions: list[FulfillmentOrderSessionRow] = []
    for i in range(total):
        fulfillment_order_id = base_id + i
        created_at = _random_date_within_last_week(now)
        orders.append(
            FulfillmentOrderRow(
                id=fulfillment_order_id,
                date=created_at,
            )
        )
        sessions.extend(
            _random_sessions(
                fulfillment_order_id=fulfillment_order_id, created_at=created_at
            )
        )
    return orders, sessions


FULFILLMENT_ORDERS, FULFILLMENT_ORDER_SESSIONS = _generate_fulfillment_orders()


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
