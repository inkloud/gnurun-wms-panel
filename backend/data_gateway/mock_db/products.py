__all__ = ["PRODUCTS"]

import random
import string

from ..types import LocationInfo, ProductRow


def _generate_random_position():
    return (
        f"{random.choice(string.ascii_uppercase)}{random.choice(string.ascii_uppercase + string.digits)}"
        f".{random.randint(0, 99):02d}"
        f".{random.randint(0, 99):02d}"
        f".{random.randint(0, 99):02d}"
    )


def _unique_position(used_positions: set[str]) -> str:
    while True:
        candidate = _generate_random_position()
        if candidate not in used_positions:
            used_positions.add(candidate)
            return candidate


def _generate_random_product(idx: int, used_positions: set[str]) -> ProductRow:
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
        _generate_random_product(idx, used_positions) for idx in range(total_products)
    ]


PRODUCTS: list[ProductRow] = _generate_products()
