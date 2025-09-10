# AutoU Email AI – README Geral

**Aplicação completa** para classificar emails e sugerir respostas: backend FastAPI com OpenAI GPT e frontend Next.js para upload e visualização.

## Tecnologias
Backend: Python 3.10+, FastAPI, Uvicorn, OpenAI API (gpt-4o-mini), PyMuPDF (fitz), Pydantic, python-dotenv.  
Frontend: Next.js 14 (App Router, Server Actions), TypeScript, Tailwind, shadcn/ui, lucide-react.

## Requisitos
Git, Python 3.10+, Node.js 18+, chave válida da OpenAI (para rodar localmente).

## Instruções
Obs: Cada frente do projeto conta com um readme mais completo e tecnico detalhando o projeto.

Para rodar o projeto abra dois terminais na raiz do projeto e rode:

backend:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
uvicorn app.main:app --reload
```

frontend:
```bash
npm i
npm run dev
```