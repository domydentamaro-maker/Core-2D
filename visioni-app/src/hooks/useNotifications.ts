import { useEffect, useState } from 'react';
import { requestNotificationPermission } from '../services/notifications';

export function useNotifications(autoAsk = false) {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (!autoAsk) return;
    requestNotificationPermission().then(setPermission);
  }, [autoAsk]);

  return {
    permission,
    askPermission: async () => {
      const p = await requestNotificationPermission();
      setPermission(p);
      return p;
    },
  };
}
