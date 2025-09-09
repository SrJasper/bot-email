from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.services import router as services_router

# app config
app = FastAPI(title="AutoU Email AI", version="0.4.0")

# middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOW_ORIGINS,  # configurável em config.py
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# health-check simples
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API is running!"}

# inclui as rotas dos serviços
app.include_router(services_router)
