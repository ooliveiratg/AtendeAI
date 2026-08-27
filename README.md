# AtendeAI (projeto fictício para teste técnico)

Este repositório é um projeto **fictício**, criado apenas para o processo seletivo da Cuattro. Ele simula (em pequena escala) o tipo de produto que a Cuattro constrói de verdade: uma plataforma multi-tenant de análise de atendimentos com IA. Nenhum dado aqui é real.

A stack é a mesma usada em produção na Cuattro:

- **Frontend:** React + Vite + TypeScript (`/web`)
- **Backend:** Firebase Cloud Functions em Node.js/TypeScript (`/functions`)
- **Banco de dados:** Firestore (rodando localmente via emulador — você não precisa de nenhuma conta de nuvem)
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) — todo Pull Request roda os testes automaticamente

## O que já vem pronto

- Estrutura de pastas do front-end e das functions
- Um modelo de dados inicial multi-tenant: `tenants` (empresas clientes) e `atendimentos` (registros de atendimento, com transcrição fictícia)
- Uma function de exemplo (`ping`) e uma function simples de listagem (`listAtendimentos`)
- Um script de seed com dados fictícios de 2 tenants diferentes
- Um exemplo de teste automatizado (Jest) rodando contra o emulador do Firestore
- Um pipeline de CI básico

**O que você precisa fazer está descrito no enunciado do teste que você recebeu junto com este repositório** (`TESTES/teste-basico.md`, `teste-intermediario.md` ou `teste-avancado.md` — apenas o arquivo do seu nível foi enviado a você).

## Como rodar

Pré-requisitos: Node.js 20+, e a CLI do Firebase (`npm install -g firebase-tools`).

```bash
# 1. Instalar dependências
cd functions && npm install && cd ..
cd web && npm install && cd ..

# 2. Rodar os emuladores (Firestore + Functions), a partir da raiz do repositório
firebase emulators:start

# 3. Em outro terminal, popular o banco com dados fictícios
cd functions && npm run seed

# 4. Em outro terminal, rodar o front-end
cd web && npm run dev
```

O front-end abre em `http://localhost:5173` e já está configurado para conversar com os emuladores locais (nenhuma credencial de nuvem é necessária).

Para rodar os testes automatizados das functions:

```bash
cd functions && npm test
```

## Como entregar

1. Crie um repositório novo e **privado** no seu GitHub, com este conteúdo.
2. Trabalhe em uma branch separada (ex: `feature/teste`) e abra um **Pull Request** para a `main` quando terminar — mesmo processo usado no time da Cuattro.
3. No corpo do Pull Request, inclua uma seção **"Como usei IA"** descrevendo, em poucas frases, quais ferramentas de IA você usou (ex: Claude Code, Copilot, ChatGPT), o que pediu a elas, e o que você revisou/corrigiu manualmente do que foi gerado. Isso faz parte da avaliação.
4. Dê acesso de leitura ao repositório para a pessoa que enviou o teste (ou torne público, se preferir) e envie o link do Pull Request.

Qualquer dúvida sobre o ambiente (não sobre a solução do teste), pode perguntar à pessoa que enviou o teste.
