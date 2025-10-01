import jwt

USERS: dict[str, str] = {
    "bacchilu@gmail.com": "bacchilu",
    "luca@life365.eu": "luca",
}
SECRET: str = "Salve, mondo!"
ALGORITHM: str = "HS256"


def check_credentials(username: str, password: str) -> dict | None:
    pwd = USERS.get(username)
    if pwd == password:
        token = jwt.encode({"username": username}, SECRET, algorithm=ALGORITHM)
        return {"access_token": token, "user": {"username": username}}
    return None


def check_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        return {"access_token": token, "user": {"username": payload["username"]}}
    except jwt.InvalidTokenError as exc:
        raise Exception() from exc
