__all__ = [
    "FULFILLMENT_ORDER_LINE_PICKS",
    "FULFILLMENT_ORDERS",
    "FULFILLMENT_ORDERS_PRODUCTS",
    "FULFILLMENT_ORDER_SESSIONS",
]

import random
from datetime import datetime, timedelta

from .products import PRODUCTS
from .types import (
    FulfillmentOrderLinePickRow,
    FulfillmentOrderLineRow,
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
    fulfillment_order_id: int, created_at: datetime, start_id: int
) -> tuple[list[FulfillmentOrderSessionRow], int]:
    if random.random() < 0.5:
        return [], start_id
    desired = 1 if random.random() < 0.5 else 2
    count = min(desired, len(_OPERATOR_USERNAMES))
    operator_ids = random.sample(_OPERATOR_USERNAMES, k=count)
    rows = [
        FulfillmentOrderSessionRow(
            id=start_id + idx,
            operator_id=operator_id,
            fulfillment_order_id=fulfillment_order_id,
            started_at=created_at,
        )
        for idx, operator_id in enumerate(operator_ids)
    ]
    return rows, start_id + len(rows)


def _generate_fulfillment_orders() -> tuple[
    list[FulfillmentOrderRow], list[FulfillmentOrderSessionRow]
]:
    now = datetime.now()
    total = random.randint(0, 10)
    base_id = 1001
    orders: list[FulfillmentOrderRow] = []
    sessions: list[FulfillmentOrderSessionRow] = []
    session_id = 1
    for i in range(total):
        fulfillment_order_id = base_id + i
        created_at = _random_date_within_last_week(now)
        orders.append(
            FulfillmentOrderRow(
                id=fulfillment_order_id,
                date=created_at,
            )
        )
        new_sessions, session_id = _random_sessions(
            fulfillment_order_id=fulfillment_order_id,
            created_at=created_at,
            start_id=session_id,
        )
        sessions.extend(new_sessions)
    return orders, sessions


FULFILLMENT_ORDERS, FULFILLMENT_ORDER_SESSIONS = _generate_fulfillment_orders()
FULFILLMENT_ORDER_LINE_PICKS: list[FulfillmentOrderLinePickRow] = []


def generate_products(fulfillment_order_id: int) -> list[FulfillmentOrderLineRow]:
    picked_products: list[ProductRow] = random.sample(
        PRODUCTS, k=random.randint(1, min(25, len(PRODUCTS)))
    )
    products: list[FulfillmentOrderLineRow] = []
    for idx, picked_product in enumerate(picked_products):
        quantity = random.randint(1, picked_product.get_stock())
        if quantity <= picked_product.where[0].stock:
            products.append(
                FulfillmentOrderLineRow(
                    id=idx + 1,
                    sku=picked_product.sku,
                    name=picked_product.name,
                    fulfillment_order_id=fulfillment_order_id,
                    position_code=picked_product.where[0].position,
                    quantity_required=quantity,
                )
            )
        else:
            q = (
                picked_product.where[0].stock,
                quantity - picked_product.where[0].stock,
            )
            products.append(
                FulfillmentOrderLineRow(
                    id=idx + 1,
                    sku=picked_product.sku,
                    name=picked_product.name,
                    fulfillment_order_id=fulfillment_order_id,
                    position_code=picked_product.where[0].position,
                    quantity_required=q[0],
                )
            )
            products.append(
                FulfillmentOrderLineRow(
                    id=idx + 1,
                    sku=picked_product.sku,
                    name=picked_product.name,
                    fulfillment_order_id=fulfillment_order_id,
                    position_code=picked_product.where[1].position,
                    quantity_required=q[1],
                )
            )
    return products


FULFILLMENT_ORDERS_PRODUCTS: list[FulfillmentOrderLineRow] = []
for o in FULFILLMENT_ORDERS:
    FULFILLMENT_ORDERS_PRODUCTS.extend(generate_products(o.id))
