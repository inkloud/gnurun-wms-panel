__all__ = [
    "FULFILLMENT_ORDER_LINE_PICKS",
    "FULFILLMENT_ORDERS",
    "FULFILLMENT_ORDERS_PRODUCTS",
    "FULFILLMENT_ORDER_SESSIONS",
]

import json
from datetime import datetime
from pathlib import Path

from .products import PRODUCTS
from .types import (
    FulfillmentOrderLinePickRow,
    FulfillmentOrderLineRow,
    FulfillmentOrderRow,
    FulfillmentOrderSessionRow,
    ProductRow,
    UserTypeRow,
)
from .users import USERS

_FULFILLMENT_ORDERS_PATH = (
    Path(__file__).with_name("raw_data") / "fulfillment_orders.json"
)


def _parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value)


def _load_fulfillment_data() -> tuple[
    list[FulfillmentOrderRow],
    list[FulfillmentOrderSessionRow],
    list[FulfillmentOrderLineRow],
    list[FulfillmentOrderLinePickRow],
]:
    payload = json.loads(_FULFILLMENT_ORDERS_PATH.read_text(encoding="utf-8"))
    product_by_sku: dict[str, ProductRow] = {
        product.sku: product for product in PRODUCTS
    }

    orders: list[FulfillmentOrderRow] = []
    order_ids: set[int] = set()
    for raw_order in payload["orders"]:
        order_id = raw_order["id"]
        if order_id in order_ids:
            raise ValueError(f"Duplicate fulfillment order id '{order_id}'")
        order_ids.add(order_id)
        created_at = _parse_datetime(raw_order["date"])
        orders.append(
            FulfillmentOrderRow(
                id=order_id,
                date=created_at,
            )
        )
    orders_by_id = {order.id: order for order in orders}

    sessions: list[FulfillmentOrderSessionRow] = []
    session_ids: set[int] = set()
    session_operators_by_order: dict[int, set[str]] = {}
    for raw_session in payload["sessions"]:
        session_id = raw_session["id"]
        if session_id in session_ids:
            raise ValueError(f"Duplicate fulfillment order session id '{session_id}'")
        session_ids.add(session_id)

        fulfillment_order_id = raw_session["fulfillment_order_id"]
        if fulfillment_order_id not in order_ids:
            raise ValueError(
                f"Unknown fulfillment order id '{fulfillment_order_id}' for session '{session_id}'"
            )
        started_at = _parse_datetime(raw_session["started_at"])
        if started_at < orders_by_id[fulfillment_order_id].date:
            raise ValueError(
                f"Session '{session_id}' starts before fulfillment order '{fulfillment_order_id}'"
            )

        operator_id = raw_session["operator_id"]
        operator = USERS.get(operator_id)
        if operator is None or operator.type != UserTypeRow.OPERATOR:
            raise ValueError(
                f"Unknown operator '{operator_id}' for session '{session_id}'"
            )

        assigned_operators = session_operators_by_order.setdefault(
            fulfillment_order_id, set()
        )
        if operator_id in assigned_operators:
            raise ValueError(
                f"Duplicate operator '{operator_id}' for fulfillment order '{fulfillment_order_id}'"
            )
        assigned_operators.add(operator_id)

        sessions.append(
            FulfillmentOrderSessionRow(
                id=session_id,
                operator_id=operator_id,
                fulfillment_order_id=fulfillment_order_id,
                started_at=started_at,
            )
        )

    lines: list[FulfillmentOrderLineRow] = []
    line_ids: set[int] = set()
    quantity_by_sku_position: dict[tuple[str, str], int] = {}
    for raw_line in payload["lines"]:
        line_id = raw_line["id"]
        if line_id in line_ids:
            raise ValueError(f"Duplicate fulfillment order line id '{line_id}'")
        line_ids.add(line_id)

        fulfillment_order_id = raw_line["fulfillment_order_id"]
        if fulfillment_order_id not in order_ids:
            raise ValueError(
                f"Unknown fulfillment order id '{fulfillment_order_id}' for line '{line_id}'"
            )

        sku = raw_line["sku"]
        product = product_by_sku.get(sku)
        if product is None:
            raise ValueError(f"Unknown sku '{sku}' for line '{line_id}'")

        position_code = raw_line["position_code"]
        position_stock = next(
            (
                location.stock
                for location in product.where
                if location.position == position_code
            ),
            None,
        )
        if position_stock is None:
            raise ValueError(
                f"Unknown position '{position_code}' for sku '{sku}' on line '{line_id}'"
            )

        quantity_required = raw_line["quantity_required"]
        if quantity_required <= 0:
            raise ValueError(f"Line '{line_id}' must require a positive quantity")
        aggregated_key = (sku, position_code)
        total_quantity = (
            quantity_by_sku_position.get(aggregated_key, 0) + quantity_required
        )
        if total_quantity > position_stock:
            raise ValueError(
                f"Quantity for sku '{sku}' at position '{position_code}' exceeds stock"
            )
        quantity_by_sku_position[aggregated_key] = total_quantity

        lines.append(
            FulfillmentOrderLineRow(
                id=line_id,
                fulfillment_order_id=fulfillment_order_id,
                sku=sku,
                position_code=position_code,
                quantity_required=quantity_required,
                name=product.name,
                requires_serial_tracking=product.requires_serial_tracking,
            )
        )

    lines_by_id = {line.id: line for line in lines}
    sessions_by_id = {session.id: session for session in sessions}

    picks: list[FulfillmentOrderLinePickRow] = []
    pick_ids: set[int] = set()
    picked_quantity_by_line: dict[int, int] = {}
    for raw_pick in payload["picks"]:
        pick_id = raw_pick["id"]
        if pick_id in pick_ids:
            raise ValueError(f"Duplicate fulfillment order pick id '{pick_id}'")
        pick_ids.add(pick_id)

        session_id = raw_pick["fulfillment_order_session_id"]
        session = sessions_by_id.get(session_id)
        if session is None:
            raise ValueError(f"Unknown session id '{session_id}' for pick '{pick_id}'")

        line_id = raw_pick["fulfillment_order_line_id"]
        line = lines_by_id.get(line_id)
        if line is None:
            raise ValueError(f"Unknown line id '{line_id}' for pick '{pick_id}'")
        if line.fulfillment_order_id != session.fulfillment_order_id:
            raise ValueError(
                f"Pick '{pick_id}' references a line outside session order '{session_id}'"
            )

        quantity_picked = raw_pick["quantity_picked"]
        if quantity_picked <= 0:
            raise ValueError(f"Pick '{pick_id}' must have a positive quantity")
        total_picked = picked_quantity_by_line.get(line_id, 0) + quantity_picked
        if total_picked > line.quantity_required:
            raise ValueError(
                f"Picked quantity exceeds required quantity for line '{line_id}'"
            )
        picked_quantity_by_line[line_id] = total_picked

        picked_at = _parse_datetime(raw_pick["picked_at"])
        if picked_at < session.started_at:
            raise ValueError(
                f"Pick '{pick_id}' happens before session '{session_id}' starts"
            )

        serial_numbers = list(raw_pick.get("serial_numbers", []))
        if any(serial_number.strip() == "" for serial_number in serial_numbers):
            raise ValueError(f"Pick '{pick_id}' contains an empty serial number")
        if len(set(serial_numbers)) != len(serial_numbers):
            raise ValueError(f"Pick '{pick_id}' contains duplicate serial numbers")
        if line.requires_serial_tracking:
            if len(serial_numbers) != quantity_picked:
                raise ValueError(
                    f"Pick '{pick_id}' serial count does not match picked quantity"
                )
        elif len(serial_numbers) > 0:
            raise ValueError(
                f"Pick '{pick_id}' provides serial numbers for a non-tracked sku"
            )

        picks.append(
            FulfillmentOrderLinePickRow(
                id=pick_id,
                fulfillment_order_session_id=session_id,
                fulfillment_order_line_id=line_id,
                quantity_picked=quantity_picked,
                serial_numbers=serial_numbers,
                picked_at=picked_at,
            )
        )

    return orders, sessions, lines, picks


(
    FULFILLMENT_ORDERS,
    FULFILLMENT_ORDER_SESSIONS,
    FULFILLMENT_ORDERS_PRODUCTS,
    FULFILLMENT_ORDER_LINE_PICKS,
) = _load_fulfillment_data()
