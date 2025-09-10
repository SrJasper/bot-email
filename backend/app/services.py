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
    """
    Recebe um arquivo (.pdf ou .txt), extrai o texto e classifica com GPT.
    """
    filename = file.filename.lower()

    # garante que é .pdf ou .txt
    if not (filename.endswith(".pdf") or filename.endswith(".txt")):
        return ClassifyResponse(
            category="Improdutivo",
            confidence=1.0,
            suggested_reply="O arquivo enviado não é .pdf nem .txt."
        )

    contents = await file.read()

    # extrair texto de PDF
    if filename.endswith(".pdf"):
        import fitz
        text = ""
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
    # extrair texto de TXT
    else:
        try:
            text = contents.decode("utf-8", errors="ignore")
        except Exception:
            return ClassifyResponse(
                category="Improdutivo",
                confidence=1.0,
                suggested_reply="Erro ao ler arquivo TXT."
            )

    if not text.strip():
        return ClassifyResponse(
            category="Improdutivo",
            confidence=1.0,
            suggested_reply="Não foi possível extrair texto do arquivo."
        )

    # mesma lógica do classify_pdf
    prompt = f"""
    Você é um assistente que analisa emails em arquivos (.pdf ou .txt).
    Classifique o seguinte conteúdo em:
    - Produtivo
    - Improdutivo

    Conteúdo:
    {text}

    Responda em JSON com os campos:
    category, confidence, suggested_reply
    """

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    raw = completion.choices[0].message.content or ""
    cleaned = clean_response(raw)

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
