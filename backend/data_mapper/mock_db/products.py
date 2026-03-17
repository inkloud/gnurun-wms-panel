__all__ = ["PRODUCTS"]

import json
from pathlib import Path

from .types import LocationInfo, ProductRow

_PRODUCTS_PATH = Path(__file__).with_name("raw_data") / "products.json"


def _load_products() -> list[ProductRow]:
    payload = json.loads(_PRODUCTS_PATH.read_text(encoding="utf-8"))
    products: list[ProductRow] = []
    used_ids: set[int] = set()
    used_skus: set[str] = set()
    used_positions: set[str] = set()

    for raw_product in payload["products"]:
        product_id = raw_product["id"]
        if product_id in used_ids:
            raise ValueError(f"Duplicate product id '{product_id}'")
        used_ids.add(product_id)

        sku = raw_product["sku"]
        if sku in used_skus:
            raise ValueError(f"Duplicate sku '{sku}'")
        used_skus.add(sku)

        locations: list[LocationInfo] = []

        for raw_location in raw_product["where"]:
            position = raw_location["position"]
            if position in used_positions:
                raise ValueError(f"Duplicate product position '{position}'")
            used_positions.add(position)

            stock = raw_location["stock"]
            if stock <= 0:
                raise ValueError(
                    f"Product '{sku}' has non-positive stock at position '{position}'"
                )

            locations.append(
                LocationInfo(
                    stock=stock,
                    position=position,
                )
            )

        products.append(
            ProductRow(
                id=product_id,
                sku=sku,
                name=raw_product["name"],
                where=locations,
            )
        )

    return products


PRODUCTS: list[ProductRow] = _load_products()
