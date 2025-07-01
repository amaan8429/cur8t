from fastapi import FastAPI
from app.api import routes

app = FastAPI()
app.include_router(routes.router)
