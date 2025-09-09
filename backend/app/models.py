from pydantic import BaseModel
from typing import Literal

class ClassifyRequest(BaseModel):
    text: str

class ClassifyResponse(BaseModel):
    category: Literal["Produtivo", "Improdutivo"]
    confidence: float
    suggested_reply: str
