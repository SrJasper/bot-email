import json
import fitz
from fastapi import APIRouter, UploadFile, File
from openai import OpenAI

from app.config import settings
from app.models import ClassifyRequest, ClassifyResponse
from app.helpers import clean_response

router = APIRouter()
client = OpenAI(api_key=settings.OPENAI_API_KEY)

@router.post("/classify-pdf", response_model=ClassifyResponse)
async def classify_pdf(file: UploadFile = File(...)):
    # verifica se é um pdf válido
    if not file.filename.lower().endswith(".pdf"):
        return ClassifyResponse(
            category="Improdutivo",
            confidence=1.0,
            suggested_reply="O arquivo enviado não é PDF."
        )

    contents = await file.read()
    text = ""

    # tenta realizar a leitura do pdf
    try:
        doc = fitz.open("pdf", contents)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        return ClassifyResponse(
            category="Improdutivo",
            confidence=1.0,
            suggested_reply=f"Erro ao ler PDF: {str(e)}"
        )

    if not text.strip():
        return ClassifyResponse(
            category="Improdutivo",
            confidence=1.0,
            suggested_reply="Não foi possível extrair texto do PDF."
        )

    # prompt pra IA
    prompt = f"""
    Você é um assistente que analisa emails em PDF.
    Classifique o seguinte conteúdo em:
    - Produtivo
    - Improdutivo

    Conteúdo:
    {text}

    Responda em JSON com os campos:
    category, confidence, suggested_reply
    """
    # chama o modelo da OpenAI com o prompt definido acima.
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    # extrai e limpa o texto gerado pelo modelo da resposta retornada
    raw = completion.choices[0].message.content or ""
    cleaned = clean_response(raw)

    # tenta converter o texto limpo para JSON
    try:
        parsed = json.loads(cleaned)
        return ClassifyResponse(
            category=parsed.get("category", "Produtivo"),
            confidence=float(parsed.get("confidence", 0.5)),
            suggested_reply=str(parsed.get("suggested_reply", "")).strip(),
        )
    except Exception:
        return ClassifyResponse(
            category="Produtivo",
            confidence=0.5,
            suggested_reply=cleaned,
        )
