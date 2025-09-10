# AutoU Email AI – Frontend

Interface web do projeto AutoU Email AI. Permite o upload de arquivos de email em PDF, envia para o backend para classificação em **Produtivo** ou **Improdutivo** e exibe a resposta automática sugerida.

> Observação: este frontend depende do backend em FastAPI. O backend usa a API do OpenAI GPT e, para execução local, é necessário possuir uma chave válida. O projeto tem limite de tokens; se o processamento parar de funcionar, provavelmente o limite foi atingido (ver README do backend).

---

## Sumário
1. [Resumo](#resumo)  
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)  
3. [Pré-requisitos](#pré-requisitos)  
4. [Configuração do Ambiente](#configuração-do-ambiente)  
   4.1. [.env.local.example](#envlocalexample)  
5. [Execução](#execução)  
6. [Integração com o Backend](#integração-com-o-backend)  
7. [Fluxo de Funcionamento](#fluxo-de-funcionamento)  
8. [Estrutura de Pastas](#estrutura-de-pastas)

---

## Resumo
Aplicação Next.js (App Router) com Server Actions para enviar arquivos ao backend e exibir os resultados com componentes de UI. Possui drag-and-drop, validações de tamanho e tipo de arquivo, toasts de erro e uma apresentação limpa dos resultados.

---

## Tecnologias Utilizadas
- Node.js 18+  
- Next.js 14+ (App Router e Server Actions)  
- TypeScript  
- Tailwind CSS  
- shadcn/ui (Button, Card, Badge, Toast/Toaster)  
- lucide-react (ícones)

---

## Pré-requisitos
- Backend rodando e acessível (por padrão, em `http://127.0.0.1:8000`).  
- CORS configurado para permitir o domínio do frontend (o backend do projeto está com `ALLOW_ORIGINS=["*"]` por padrão, mas ajuste em produção).  
- Node.js 18 ou superior.

---

## Configuração do Ambiente

1. Clone o repositório e acesse a pasta do frontend:
   ```bash
   git clone https://github.com/seu-repositorio/autou-email-ai.git
   cd autou-email-ai/frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   pnpm install
   # ou
   yarn
   ```

3. Copie o arquivo de exemplo de ambiente e ajuste as variáveis:
   ```bash
   cp .env.local.example .env.local
   ```
   Garanta que o backend esteja rodando e que a URL esteja correta em `NEXT_PUBLIC_API_URL` (ver seção [Integração com o Backend](#integração-com-o-backend)).

### .env.local.example
```env
# URL do backend FastAPI
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## Execução

**Desenvolvimento:**
```bash
npm run dev
# ou
pnpm dev
# ou
yarn dev
```

**Produção:**
```bash
npm run build
npm run start
```

**Lint (opcional):**
```bash
npm run lint
```

A aplicação ficará disponível em `http://localhost:9002` por padrão.

---

## Integração com o Backend
Endpoint utilizado: `POST {NEXT_PUBLIC_API_URL}/classify-pdf`

Payload: `multipart/form-data` com o campo `file` (PDF)

Resposta esperada:
```json
{
  "category": "Produtivo",
  "confidence": 0.92,
  "suggested_reply": "Olá! Seu pedido está em andamento e será atualizado em breve."
}
```

O frontend mapeia:
- `category` → Exibição do selo de categoria
- `confidence` → Exibido internamente (pode ser mostrado no UI se desejar)
- `suggested_reply` → Exibido como "Sugestão de Resposta"

---

## Fluxo de Funcionamento
1. O usuário arrasta/seleciona um arquivo PDF (máx. 5 MB).
2. `app/page.tsx` cria um `FormData` e envia via Server Action `analyzeEmail`.
3. `app/actions.ts` executa `fetch` para `{NEXT_PUBLIC_API_URL}/classify-pdf`.
4. O backend responde com `category`, `confidence`, `suggested_reply`.
5. O estado é atualizado e `components/analysis-results.tsx` exibe os resultados.
6. Em caso de erro, um toast é exibido e o formulário é resetado.

---

## Estrutura de Pastas
```bash
frontend/
├─ src/
│  ├─ app/
│  │  ├─ actions.ts
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ analysis-results.tsx
│  │  ├─ submit-button.tsx
│  │  └─ ui/
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ toast.tsx
│  │     └─ toaster.tsx
│  ├─ hooks/
│  │  ├─ use-mobile.tsx
│  │  └─ use-toast.ts
│  └─ lib/
│     └─ utils.ts
├─ public/
├─ .env.local.example
├─ package.json
└─ README.md
```

