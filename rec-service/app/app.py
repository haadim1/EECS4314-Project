from fastapi import FastAPI
from app.routes import recommend

app = FastAPI()

app.include_router(recommend.router)