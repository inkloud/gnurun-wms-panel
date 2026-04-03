def encode_id(prefix: str, id: int) -> str:
    return f"{prefix}-{id:04d}"


def decode_id(prefix: str, id: str) -> int:
    return int(id.split(f"{prefix}-")[1])
