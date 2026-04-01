import { TIMELINE_START } from './constants';

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - TIMELINE_START) * 60 + m;
}

export function groupByRoomId<T extends { roomId: string }>(items: T[]) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const list = map.get(item.roomId);
    if (list) {
      list.push(item);
    } else {
      map.set(item.roomId, [item]);
    }
  }
  return map;
}
