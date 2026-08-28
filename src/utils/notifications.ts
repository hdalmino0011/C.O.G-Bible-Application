import { DailyVerse, getTodayVerse } from '../data/dailyVerses';

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionStatus(): NotificationPermissionState {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermissionState;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
}

export async function sendDailyVerseNotification(
  verse?: DailyVerse,
  customTitle?: string
): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    const perm = await requestNotificationPermission();
    if (perm !== 'granted') return false;
  }

  const v = verse || getTodayVerse();
  const title = customTitle || `📖 Today's Verse: ${v.book} ${v.chapter}:${v.verse}`;
  const bodyText = `"${v.ceb}"\n— ${v.en}`;

  const options: Record<string, unknown> = {
    body: bodyText,
    icon: './logo.png',
    badge: './app-icon-192.png',
    tag: 'cog-daily-verse',
    renotify: true,
    data: {
      url: `./#bible?book=${encodeURIComponent(v.book)}&chapter=${v.chapter}&verse=${v.verse}`,
      book: v.book,
      chapter: v.chapter,
      verse: v.verse
    },
    vibrate: [200, 100, 200]
  };

  // Try via active service worker registration first for mobile OS lockscreen compatibility
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, options as NotificationOptions);
        return true;
      }
    } catch (e) {
      console.warn('SW notification fallback to window.Notification', e);
    }
  }

  // Fallback to standard window Notification constructor
  try {
    const n = new Notification(title, options as NotificationOptions);
    n.onclick = () => {
      window.focus();
      n.close();
      if (typeof window !== 'undefined') {
        window.location.hash = `bible?book=${encodeURIComponent(v.book)}&chapter=${v.chapter}&verse=${v.verse}`;
        window.dispatchEvent(
          new CustomEvent('cog-navigate-verse', {
            detail: { book: v.book, chapter: v.chapter, verse: v.verse }
          })
        );
      }
    };
    return true;
  } catch (e) {
    console.error('Error creating Notification instance:', e);
    return false;
  }
}
