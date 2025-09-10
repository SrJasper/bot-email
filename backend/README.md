# AutoU Email AI - Backend

Este é o **backend da aplicação AutoU Email AI**, responsável por processar emails em arquivos `.pdf` ou `.txt`, classificá-los em **Produtivo** ou **Improdutivo**, e sugerir respostas automáticas usando **OpenAI GPT**.

---

## Sumário
1. [Resumo](#resumo)  
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)  
3. [Configuração do Ambiente](#configuração-do-ambiente)  
4. [Como Executar](#como-executar)  
5. [Endpoints Disponíveis](#endpoints-disponíveis)  
6. [Estrutura do Backend](#estrutura-do-backend)

---

## Resumo
O backend utiliza **FastAPI** como framework principal, integra-se à **API do OpenAI** para classificação e sugestão de respostas, e suporta upload de arquivos em **.pdf** e **.txt**.  

Ele foi desenvolvido para rodar localmente ou em produção, desde que uma chave válida do OpenAI seja configurada.  

---

## Tecnologias Utilizadas
- Python 3.10+  
- [FastAPI](https://fastapi.tiangolo.com/)  
- [Uvicorn](https://www.uvicorn.org/)  
- [OpenAI API](https://platform.openai.com/)  
- [PyMuPDF (fitz)](https://pymupdf.readthedocs.io/) (leitura de PDFs)  
- [python-dotenv](https://pypi.org/project/python-dotenv/) (variáveis de ambiente)  

---

## Configuração do Ambiente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-repositorio/autou-email-ai.git
cd autou-email-ai/backend
```

### 2. Crie um ambiente virtual
```bash
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows
```

### 3. Instale as dependências
```bash
pip install -r requirements.txt
```

#### 4. configure o arquivo .env
Copie o arquivo de exemplo:
```bash
cp .env-exemple .env
```
Edite o arquivo .env e adicione sua chave do OpenAI:
```bash
OPENAI_API_KEY=coloque_sua_chave_aqui
```
Importante:
O backend depende da API do OpenAI GPT para funcionar localmente.
Você precisa de uma chave válida para rodar o projeto.
A aplicação possui limite de tokens — se parar de funcionar, provavelmente esse limite foi atingido.

## Como executar

### Rodar em modo desenvolvimento
```bash
uvicorn app.main:app --reload
```

### Rodas em produção
```bash
uvicorn app.main:app --reload
```

## Endpoints disponíveis

### 1. Health Check

Rota:
```bash
GET /health
```

Resposta:
```json
{
  "status": "ok",
  "message": "API is running!"
}
```

### 1. Classificação de Arquivos

Rota:
```bash
POST /classify-pdf
```

Resposta:
```json
{
  "category": "Produtivo",
  "confidence": 0.92,
  "suggested_reply": "Olá! Seu pedido está em andamento e será atualizado em breve."
}
```

## Estrutura do backend
```bash
backend/
├── app/
│   ├── config.py        # Configurações e variáveis de ambiente
│   ├── helpers.py       # Funções auxiliares
│   ├── models.py        # Modelos Pydantic
│   ├── services.py      # Rotas e lógica de classificação
│   └── main.py          # Inicialização da aplicação
├── requirements.txt
├── .env-exemple
├── .gitignore
└── README.md
```