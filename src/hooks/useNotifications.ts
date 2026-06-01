import { useEffect, useRef, useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useSettingsStore } from '../store/useSettingsStore';
import type { Task } from '../models/Task';

const NOTIFIED_KEY = 'todo-notified-ids';
const SUMMARY_KEY = 'todo-summary-date';

function getNotifiedIds(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function markNotified(id: string) {
  const ids = getNotifiedIds();
  ids.add(id);
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...ids]));
}

function getLastSummaryDate(): string | null {
  return localStorage.getItem(SUMMARY_KEY);
}

function setLastSummaryDate(date: string) {
  localStorage.setItem(SUMMARY_KEY, date);
}

function showNotification(title: string, body: string) {
  if (Notification.permission !== 'granted') return;
  new Notification(title, { body, icon: '/pwa-192x192.png' });
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getTodayTasks(tasks: Task[]): Task[] {
  const today = getTodayStr();
  return tasks.filter((t) => !t.completed && !t.removed && t.dueDate === today);
}

function checkTaskNotifications(tasks: Task[], leadMinutes: number) {
  const now = Date.now();
  const notified = getNotifiedIds();

  for (const task of tasks) {
    if (task.completed || task.removed || !task.dueDate || !task.dueTime) continue;
    if (notified.has(task.id)) continue;

    const taskTime = new Date(`${task.dueDate}T${task.dueTime}`).getTime();
    const notifyAt = taskTime - leadMinutes * 60 * 1000;

    if (now >= notifyAt && now < taskTime + 60 * 60 * 1000) {
      showNotification(task.title, `Due at ${task.dueTime}`);
      markNotified(task.id);
    }
  }
}

function checkMorningSummary(tasks: Task[], summaryTime: string) {
  const today = getTodayStr();
  if (getLastSummaryDate() === today) return;

  const now = new Date();
  const [h, m] = summaryTime.split(':').map(Number);
  const summaryMoment = new Date();
  summaryMoment.setHours(h, m, 0, 0);

  if (now < summaryMoment) return;

  const todayTasks = getTodayTasks(tasks);
  if (todayTasks.length === 0) {
    setLastSummaryDate(today);
    return;
  }

  const lines = todayTasks
    .map((t) => {
      const time = t.dueTime ? ` at ${t.dueTime}` : '';
      return `• ${t.title}${time}`;
    })
    .join('\n');

  showNotification(
    `Today: ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''}`,
    lines
  );
  setLastSummaryDate(today);
}

export function useNotifications() {
  const tasks = useTaskStore((s) => s.tasks);
  const leadMinutes = useSettingsStore((s) => s.notificationLeadMinutes);
  const summaryTime = useSettingsStore((s) => s.dailySummaryTime);
  const intervalRef = useRef<number | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((result) => {
        setPermission(result);
      });
    }
  }, []);

  useEffect(() => {
    if (permission !== 'granted') return;

    const check = () => {
      checkTaskNotifications(tasks, leadMinutes);
      checkMorningSummary(tasks, summaryTime);
    };

    check();
    intervalRef.current = window.setInterval(check, 60_000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [tasks, leadMinutes, summaryTime, permission]);
}
