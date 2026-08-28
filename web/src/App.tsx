import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

type Atendimento = {
  id: string;
  transcricao: string;
  status: string;
  prioridade?: string;
  duracaoSegundos: number;
};

export default function App() {
  const [tenantId, setTenantId] = useState("tenant-alfa");
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function getPrioridadeColor(prioridade?: string) {
    switch (prioridade?.toLowerCase()) {
      case "alta":
        return "#FF0000";

      case "média":
      case "media":
        return "#FF9900";

      case "baixa":
        return "#FFFF00";

      default:
        return "#808080";
    }
  }

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const listAtendimentos = httpsCallable(functions, "listAtendimentos");
      const resp = await listAtendimentos({ tenantId });

      setAtendimentos(
        (resp.data as { atendimentos: Atendimento[] }).atendimentos,
      );
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      style={{ fontFamily: "sans-serif", maxWidth: 720, margin: "40px auto" }}
    >
      <h1>AtendeAI — projeto de teste</h1>
      <p>
        Tenant: <code>{tenantId}</code>{" "}
        <button
          onClick={() =>
            setTenantId(
              tenantId === "tenant-alfa" ? "tenant-beta" : "tenant-alfa",
            )
          }
        >
          trocar tenant
        </button>{" "}
        <button onClick={carregar} disabled={carregando}>
          {carregando ? "carregando..." : "carregar atendimentos"}
        </button>
      </p>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <ul>
        {atendimentos.map((a) => (
          <section
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              backgroundColor: "rgb(0, 0, 0, 0.2)",
              borderRadius: 13,
              padding: 10,
              marginBottom: 5,
              alignItems: "center",
            }}
            key={a.id}
          >
            <div>
              <strong>{a.status}</strong> ({a.duracaoSegundos}s) —{" "}
              {a.transcricao}
            </div>
            <div
              style={{
                height: 10,
                width: 10,
                borderRadius: 100,
                backgroundColor: getPrioridadeColor(a.prioridade),
              }}
            ></div>
          </section>
        ))}
      </ul>
    </div>
  );
}
