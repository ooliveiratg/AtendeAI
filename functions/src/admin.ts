import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp({ projectId: "atendeai-teste-local" });
}

export const db = admin.firestore();
