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

##