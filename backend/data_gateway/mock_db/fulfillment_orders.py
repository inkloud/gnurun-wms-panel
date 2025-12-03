__all__ = ["FULFILLMENT_ORDERS", "PRODUCTS", "generate_products"]

import random
import string
from datetime import datetime, timedelta
from functools import lru_cache

from ..types import (
    FulfillmentOrderProductRow,
    FulfillmentOrderRow,
    LocationInfo,
    ProductRow,
)
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


def generate_random_position():
    return (
        f"{random.choice(string.ascii_uppercase)}{random.choice(string.ascii_uppercase + string.digits)}"
        f".{random.randint(0, 99):02d}"
        f".{random.randint(0, 99):02d}"
        f".{random.randint(0, 99):02d}"
    )


def _unique_position(used_positions: set[str]) -> str:
    while True:
        candidate = generate_random_position()
        if candidate not in used_positions:
            used_positions.add(candidate)
            return candidate


def generate_random_product(idx: int, used_positions: set[str]) -> ProductRow:
    total_stock = random.randint(0, 1000)
    sku = f"SKU-{idx + 1:03d}"
    name = f"Product {idx + 1}"
    has_multiple_locations = total_stock > 1 and random.random() >= 0.9

    if not has_multiple_locations:
        locations = [
            LocationInfo(stock=total_stock, position=_unique_position(used_positions))
        ]
    else:
        first_stock = random.randint(1, total_stock - 1)
        second_stock = total_stock - first_stock
        locations = [
            LocationInfo(stock=first_stock, position=_unique_position(used_positions)),
            LocationInfo(stock=second_stock, position=_unique_position(used_positions)),
        ]
    return ProductRow(id=idx + 1, sku=sku, name=name, where=locations)


def _generate_products() -> list[ProductRow]:
    total_products = random.randint(0, 100)
    used_positions: set[str] = set()
    return [
        generate_random_product(idx, used_positions) for idx in range(total_products)
    ]


PRODUCTS: list[ProductRow] = _generate_products()


@lru_cache(maxsize=None)
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
