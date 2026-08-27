import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db } from "./admin";
import { PrioridadeTiposEnum } from "./enum/PrioridadeEnum";
import { createAtendimentoDTO } from "./dto/CreateAtendimentoDTO";

/**
 * Function de exemplo — só para você confirmar que o ambiente está rodando.
 */
export const ping = onCall(() => {
  return { ok: true, message: "pong" };
});

/**
 * Lista os atendimentos de UM tenant.
 *
 * ATENÇÃO: esta função hoje recebe o tenantId diretamente no payload da
 * chamada, sem validar se quem está chamando de fato pertence a esse tenant.
 * Isso é proposital — faz parte do que os testes técnicos pedem para revisar,
 * dependendo do nível do teste que você recebeu.
 */
export const listAtendimentos = onCall(async (request) => {
  const tenantId = request.data?.tenantId;

  if (!tenantId || typeof tenantId !== "string") {
    throw new HttpsError("invalid-argument", "tenantId é obrigatório.");
  }

  const snapshot = await db
    .collection("atendimentos")
    .where("tenantId", "==", tenantId)
    .get();

  return {
    atendimentos: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  };
});

/**
 * Cria um novo registro de atendimento para um tenant.
 * Implementação mínima — sem validação de schema.
 */
export const createAtendimento = onCall(async (request) => {
  const {
    tenantId,
    transcricao,
    duracaoSegundos,
    prioridade,
  }: createAtendimentoDTO = request.data ?? {};

  if (!tenantId || typeof tenantId !== "string") {
    throw new HttpsError("invalid-argument", "tenantId é obrigatório.");
  }

  let dbPrioridade: PrioridadeTiposEnum = PrioridadeTiposEnum.media;

  if (prioridade != null) {
    if (
      prioridade === PrioridadeTiposEnum.alta ||
      prioridade === PrioridadeTiposEnum.baixa ||
      prioridade === PrioridadeTiposEnum.media
    ) {
      dbPrioridade = prioridade;
    } else {
      throw new HttpsError("invalid-argument", "prioridade inválida.");
    }
  }

  const doc = await db.collection("atendimentos").add({
    tenantId,
    transcricao: transcricao ?? "",
    duracaoSegundos: duracaoSegundos ?? 0,
    prioridade: dbPrioridade,
    status: "novo",
    criadoEm: new Date().toISOString(),
  });

  return { id: doc.id };
});
