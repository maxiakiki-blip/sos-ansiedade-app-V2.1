export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function showNotification(title: string, body: string, icon = '/icon-192.png') {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title,
      body,
      icon,
    });
  } else {
    new Notification(title, { body, icon });
  }
}

export function checkAndShowDailyReminder(logs: Record<string, string[]>) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs[today] || [];
  if (todayLogs.length === 0) {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 22) {
      showNotification(
        'S.O.S Ansiedade 💜',
        'Que tal praticar uma técnica hoje? Pequenos passos fazem grande diferença.',
      );
    }
  }
}
