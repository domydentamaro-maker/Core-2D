import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { haversineKm } from '../../services/geofencing';
import { sendLocalNotification } from '../../services/notifications';
import { storage } from '../../services/storage';
import { listRadarImmobili, saveRadarProfile } from '../../services/wordpress';
import type { ImmobileGeo, ProfiloRicerca } from './radar.types';

const HISTORY_KEY = 'visioni.radar.notifications';

export function useRadar(profile?: ProfiloRicerca | null) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [immobili, setImmobili] = useState<ImmobileGeo[]>([]);
  const [compatibili, setCompatibili] = useState<ImmobileGeo[]>([]);
  const watchRef = useRef<number | null>(null);

  const initRadar = useCallback(async () => {
    if (!navigator.geolocation) return false;
    await Notification.requestPermission();
    return true;
  }, []);

  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number) => {
    return haversineKm(lat1, lng1, lat2, lng2);
  }, []);

  const wasNotifiedIn24h = useCallback((id: string) => {
    const history = storage.get<Record<string, number>>(HISTORY_KEY, {});
    const last = history[id] ?? 0;
    return Date.now() - last < 24 * 60 * 60 * 1000;
  }, []);

  const markNotified = useCallback((id: string) => {
    const history = storage.get<Record<string, number>>(HISTORY_KEY, {});
    history[id] = Date.now();
    storage.set(HISTORY_KEY, history);
  }, []);

  const triggerNotification = useCallback((immobile: ImmobileGeo) => {
    sendLocalNotification('2D Radar: nuovo match vicino a te', `${immobile.titolo} a ${Math.round(immobile.prezzo).toLocaleString('it-IT')}€`, {
      url: `/immobili/${immobile.slug}`,
    });
    markNotified(immobile.id);
  }, [markNotified]);

  const findCompatibleImmobili = useCallback((pos: { lat: number; lng: number }, profilo: ProfiloRicerca, list: ImmobileGeo[]) => {
    return list.filter((i) => {
      const distanceM = calculateDistance(pos.lat, pos.lng, i.lat, i.lng) * 1000;
      const inRange = distanceM <= profilo.raggioAlert;
      const byType = i.tipologia === profilo.tipologia;
      const byVani = i.vani >= profilo.vaniMin && i.vani <= profilo.vaniMax;
      const byPrice = i.prezzo >= profilo.budgetMin && i.prezzo <= profilo.budgetMax;
      const byZone = profilo.zone.length === 0 || profilo.zone.includes(i.zona);
      const byGarage = profilo.garage === 'no' || (profilo.garage === 'preferibile' ? true : i.garage);
      return inRange && byType && byVani && byPrice && byZone && byGarage && !wasNotifiedIn24h(i.id);
    });
  }, [calculateDistance, wasNotifiedIn24h]);

  const watchPosition = useCallback(() => {
    if (!navigator.geolocation || watchRef.current != null) return;
    watchRef.current = navigator.geolocation.watchPosition(
      async (p) => {
        const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
        setPosition(pos);
        const list = (await listRadarImmobili(pos.lat, pos.lng)) as ImmobileGeo[];
        setImmobili(list);
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!profile || !position) return;
    const found = findCompatibleImmobili(position, profile, immobili);
    setCompatibili(found);
    found.forEach(triggerNotification);
  }, [position, immobili, profile, findCompatibleImmobili, triggerNotification]);

  useEffect(() => () => {
    if (watchRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchRef.current);
    }
  }, []);

  const saveProfile = useCallback(async (p: ProfiloRicerca) => {
    storage.set('visioni.radar.profile', p);
    await saveRadarProfile(p);
  }, []);

  return useMemo(() => ({
    position,
    immobili,
    compatibili,
    initRadar,
    watchPosition,
    calculateDistance,
    findCompatibleImmobili,
    triggerNotification,
    saveProfile,
  }), [position, immobili, compatibili, initRadar, watchPosition, calculateDistance, findCompatibleImmobili, triggerNotification, saveProfile]);
}
