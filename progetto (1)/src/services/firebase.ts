export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  messagingSenderId?: string;
  appId?: string;
}

export function initFirebase(config: FirebaseConfig): { enabled: boolean } {
  const enabled = Boolean(config.apiKey && config.projectId);
  return { enabled };
}
