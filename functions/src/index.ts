import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db } from "./admin";
import { PrioridadeTiposEnum } from "./enum/PrioridadeEnum";
import { CreateAtendimentoDTO } from "./dto/CreateAtendimentoDTO";
import { UpdateAtendimentoDTO } from "./dto/UpdateAtendimentoDTO";
import { StatusEnum } from "./enum/StatusEnum";

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
  }: CreateAtendimentoDTO = request.data ?? {};

  if (!tenantId || typeof tenantId !== "string") {
    throw new HttpsError("invalid-argument", "tenantId é obrigatório.");
  }

  let dbPrioridade: PrioridadeTiposEnum = PrioridadeTiposEnum.media;

  if (prioridade != null) {
    if (
      [
        PrioridadeTiposEnum.alta,
        PrioridadeTiposEnum.baixa,
        PrioridadeTiposEnum.media,
      ].includes(prioridade)
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

export const updateAtendimentoStatus = onCall(async (request) => {
  const { atendimentoId, novoStatus, tenantId }: UpdateAtendimentoDTO =
    request.data ?? {};

  if (!tenantId || !novoStatus) {
    throw new HttpsError(
      "invalid-argument",
      "tenantId e novoStatus é obrigatório.",
    );
  }

  const atendimentoDoc = await db
    .collection("atendimentos")
    .doc(atendimentoId)
    .get();
  if (!atendimentoDoc.exists) {
    throw new HttpsError("not-found", "Atendimento não encontrado.");
  }

  const atendimento = atendimentoDoc.data();

  if (atendimento?.tenantId !== tenantId) {
    throw new HttpsError("not-found", "TenantId não encontrado.");
  }

  if (
    ![StatusEnum.novo, StatusEnum.pendente, StatusEnum.resolvido].includes(
      novoStatus,
    )
  ) {
    throw new HttpsError("not-found", "TenantId não encontrado.");
  }

  await db.collection("atendimentos").doc(atendimentoId).update({
    status: novoStatus,
  });

  return {
    message: "Atualizado com sucesso",
    id: atendimentoId,
    status: novoStatus,
  };
});
