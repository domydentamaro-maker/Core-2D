const API_BASE = import.meta.env.VITE_WP_API_BASE ?? 'https://visioniimmobiliari.2dsviluppoimmobiliare.it/wp-json';

export async function wpRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`WP request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function saveRadarProfile(payload: unknown): Promise<{ ok: boolean; id?: string }> {
  try {
    return await wpRequest<{ ok: boolean; id?: string }>('/visioni-platform/v1/radar/profiles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false };
  }
}

export async function listRadarImmobili(lat?: number, lng?: number): Promise<any[]> {
  const q = lat != null && lng != null ? `?lat=${lat}&lng=${lng}` : '';
  return wpRequest<any[]>(`/visioni-platform/v1/radar/immobili${q}`);
}
