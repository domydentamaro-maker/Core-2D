export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  return Notification.requestPermission();
}

export function sendLocalNotification(title: string, body: string, data?: Record<string, string>): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const n = new Notification(title, { body, data });
  n.onclick = () => {
    const url = data?.url;
    if (url) window.open(url, '_blank');
  };
}
