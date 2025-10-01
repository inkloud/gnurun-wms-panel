import jwt
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI()


USERS: dict[str, str] = {"bacchilu@gmail.com": "bacchilu", "luca@life365.eu": "luca"}
SECRET: str = "Salve, mondo!"


def check_authentication(username: str, password: str) -> dict | None:
    pwd = USERS.get(username, None)
    if pwd == password:
        return {
            "access_token": jwt.encode({"username": username}, SECRET),
            "user": {"username": username},
        }


@app.get("/")
async def root():
    return {"Hello": "World"}


class AuthRequest(BaseModel):
    username: str
    password: str


@app.post("/auth")
async def authenticate(payload: AuthRequest):
    if (data := check_authentication(payload.username, payload.password)) is not None:
        return data
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
    )
