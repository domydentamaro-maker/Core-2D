import { useEffect, useState } from 'react';
import { listRadarImmobili } from '../services/wordpress';

export function useImmobili(lat?: number, lng?: number) {
  const [immobili, setImmobili] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listRadarImmobili(lat, lng)
      .then(setImmobili)
      .catch(() => setImmobili([]))
      .finally(() => setLoading(false));
  }, [lat, lng]);

  return { immobili, loading };
}
