from auth import check_credentials, check_token
from fastapi import FastAPI, Header, HTTPException, status
from pydantic import BaseModel
from utils import get_token_from_header

app = FastAPI()


@app.get("/")
async def root():
    return {"Hello": "World"}


class AuthRequest(BaseModel):
    username: str
    password: str


@app.post("/auth")
async def authenticate(payload: AuthRequest):
    if (data := check_credentials(payload.username, payload.password)) is not None:
        return data
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
    )


@app.get("/auth")
async def verify_authentication(
    auth_header: str = Header(..., alias="Authorization"),
):
    token = get_token_from_header(auth_header)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer scheme",
        )
    try:
        return check_token(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc
