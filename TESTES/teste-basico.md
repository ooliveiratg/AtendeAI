# Teste técnico — Nível Básico

## Contexto (fictício)

Você recebeu um "protótipo aprovado": a equipe de produto quer que cada atendimento tenha uma **prioridade** (baixa, média ou alta), para que o time de suporte saiba o que atender primeiro. O design e a regra de negócio já estão definidos abaixo — seu trabalho é produtizar isso na base de código que você recebeu (pasta `functions` e `web`), como você faria no dia a dia da vaga.

Você pode (e deve) usar ferramentas de IA generativa (Claude Code ou similar) para te ajudar a implementar — isso faz parte do que estamos avaliando. O que importa é o resultado final e sua capacidade de revisar/corrigir o que a IA produzir.

## O que fazer

1. **Campo de prioridade ao criar atendimento.** Altere a function `createAtendimento` (`functions/src/index.ts`) para aceitar um campo `prioridade` que só pode ser `"baixa"`, `"media"` ou `"alta"`.
   - Se o campo não for enviado, use `"media"` como padrão.
   - Se vier um valor diferente desses três, a function deve recusar a chamada com um erro claro (sem gravar nada no banco).
2. **Atualizar status de um atendimento.** Crie uma nova function `updateAtendimentoStatus` (onCall) que recebe `atendimentoId`, `tenantId` e `novoStatus` (um de `"novo"`, `"pendente"`, `"resolvido"`), e atualiza o documento correspondente — mas **somente se o atendimento realmente pertencer ao `tenantId` informado**. Se não pertencer (ou não existir), retorne um erro, sem alterar nada.
3. **Mostrar a prioridade no front-end.** Na tela existente (`web/src/App.tsx`), exiba a prioridade de cada atendimento na listagem (pode ser texto, cor, ícone — a forma é livre).
4. **Pelo menos um teste automatizado novo** (em `functions/test/`) cobrindo o comportamento de `createAtendimento` quando a prioridade enviada é inválida.

## O que NÃO é esperado

- Não é necessário mexer em autenticação/login (isso é assunto de outro nível de teste).
- Não é necessário deploy em nuvem real — tudo roda local, via emulador.
- Não esperamos um design bonito no front-end; funcional já basta.

## Critérios de aceite

- `createAtendimento` valida corretamente os 3 valores possíveis de prioridade e usa `"media"` como padrão.
- `updateAtendimentoStatus` nunca atualiza um atendimento de outro tenant.
- A prioridade aparece na tela.
- Existe pelo menos 1 teste automatizado novo, e ele passa (`npm test` dentro de `functions`).
- O código está organizado em um Pull Request, seguindo as instruções de entrega do `README.md` da raiz do repositório (branch, PR, seção "Como usei IA").

## Prazo sugerido

2 a 3 dias corridos a partir do recebimento deste teste, no seu próprio ritmo (não é uma prova cronometrada).
