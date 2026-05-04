from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.auth import router as auth_router
from backend.api.routes.picker import router as picker_router
from backend.api.routes.root import router as root_router
from backend.api.routes.stock_products import router as stock_products_router
from backend.api.routes.users import router as users_router

app: FastAPI = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://0.0.0.0:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(picker_router)
app.include_router(root_router)
app.include_router(stock_products_router)
app.include_router(users_router)
