import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const app = initializeApp({ projectId: "atendeai-teste-local" });

export const functions = getFunctions(app);

// Sempre conecta no emulador local — este projeto nunca fala com Firebase de produção.
connectFunctionsEmulator(functions, "localhost", 5001);
