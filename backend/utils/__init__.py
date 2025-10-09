def get_token_from_header(auth_header: str) -> str | None:
    if auth_header.lower().startswith("bearer "):
        return auth_header.split(" ", 1)[1].strip()
    return None
