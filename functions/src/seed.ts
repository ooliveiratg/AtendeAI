/* eslint-disable no-console */
import { db } from "./admin";

async function seed() {
  const tenants = [
    { id: "tenant-alfa", nome: "Alfa Telecom" },
    { id: "tenant-beta", nome: "Beta Seguros" },
  ];

  for (const tenant of tenants) {
    await db.collection("tenants").doc(tenant.id).set({ nome: tenant.nome });
  }

  const atendimentos = [
    {
      tenantId: "tenant-alfa",
      transcricao: "Cliente ligou reportando lentidão na internet. Reiniciado o roteador remotamente.",
      duracaoSegundos: 184,
      status: "resolvido",
      criadoEm: new Date().toISOString(),
    },
    {
      tenantId: "tenant-alfa",
      transcricao: "Cliente pediu segunda via de fatura. Enviado por e-mail.",
      duracaoSegundos: 97,
      status: "resolvido",
      criadoEm: new Date().toISOString(),
    },
    {
      tenantId: "tenant-beta",
      transcricao: "Cliente reclamou de demora no reembolso do sinistro. Encaminhado para o financeiro.",
      duracaoSegundos: 251,
      status: "pendente",
      criadoEm: new Date().toISOString(),
    },
  ];

  for (const atendimento of atendimentos) {
    await db.collection("atendimentos").add(atendimento);
  }

  console.log(`Seed concluído: ${tenants.length} tenants, ${atendimentos.length} atendimentos.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Erro ao popular dados de teste:", err);
  process.exit(1);
});
