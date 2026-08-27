import * as admin from "firebase-admin";

// Garante um único app inicializado apontando para o emulador
// (FIRESTORE_EMULATOR_HOST é definido no script "npm test").
if (admin.apps.length === 0) {
  admin.initializeApp({ projectId: "atendeai-teste-local" });
}

const db = admin.firestore();

describe("modelo de dados básico", () => {
  afterAll(async () => {
    await admin.app().delete();
  });

  it("permite gravar e ler um atendimento de um tenant", async () => {
    const ref = await db.collection("atendimentos").add({
      tenantId: "tenant-teste",
      transcricao: "teste automatizado",
      status: "novo",
    });

    const snapshot = await ref.get();
    expect(snapshot.exists).toBe(true);
    expect(snapshot.data()?.tenantId).toBe("tenant-teste");
  });

  // Este arquivo é só um exemplo de que o ambiente de testes está funcionando.
  // Testes adicionais (inclusive para o que você implementar) devem ser
  // adicionados por você, conforme pedido no enunciado do seu nível de teste.
});
