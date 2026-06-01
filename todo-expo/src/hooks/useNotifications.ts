import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTaskStore } from '../store/useTaskStore';
import { useSettingsStore } from '../store/useSettingsStore';
import type { Task } from '../models/Task';

const NOTIFIED_KEY = 'todo-notified-ids';
const SUMMARY_KEY = 'todo-summary-date';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function getNotifiedIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(NOTIFIED_KEY);
    return new Set(JSON.parse(raw || '[]'));
  } catch {
    return new Set();
  }
}

async function markNotified(id: string) {
  const ids = await getNotifiedIds();
  ids.add(id);
  await AsyncStorage.setItem(NOTIFIED_KEY, JSON.stringify([...ids]));
}

async function getLastSummaryDate(): Promise<string | null> {
  return AsyncStorage.getItem(SUMMARY_KEY);
}

async function setLastSummaryDate(date: string) {
  await AsyncStorage.setItem(SUMMARY_KEY, date);
}

async function showNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getTodayTasks(tasks: Task[]): Task[] {
  const today = getTodayStr();
  return tasks.filter((t) => !t.completed && !t.removed && t.dueDate === today);
}

function formatTime12(timeStr: string): string {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

async function checkTaskNotifications(tasks: Task[], leadMinutes: number) {
  const now = Date.now();
  const notified = await getNotifiedIds();

  for (const task of tasks) {
    if (task.completed || task.removed || !task.dueDate || !task.dueTime) continue;
    if (notified.has(task.id)) continue;

    const taskTime = new Date(`${task.dueDate}T${task.dueTime}`).getTime();
    const notifyAt = taskTime - leadMinutes * 60 * 1000;

    if (now >= notifyAt && now < taskTime + 60 * 60 * 1000) {
      const timeLabel = formatTime12(task.dueTime);
      await showNotification(task.title, `Due at ${timeLabel}`);
      await markNotified(task.id);
    }
  }
}

async function checkMorningSummary(tasks: Task[], summaryTime: string) {
  const today = getTodayStr();
  if ((await getLastSummaryDate()) === today) return;

  const now = new Date();
  const [h, m] = summaryTime.split(':').map(Number);
  const summaryMoment = new Date();
  summaryMoment.setHours(h, m, 0, 0);

  if (now < summaryMoment) return;

  const todayTasks = getTodayTasks(tasks);
  if (todayTasks.length === 0) {
    await setLastSummaryDate(today);
    return;
  }

  const lines = todayTasks
    .map((t) => {
      const time = t.dueTime ? ` at ${formatTime12(t.dueTime)}` : '';
      return `• ${t.title}${time}`;
    })
    .join('\n');

  await showNotification(
    `Today: ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''}`,
    lines
  );
  await setLastSummaryDate(today);
}

export function useNotifications() {
  const tasks = useTaskStore((s) => s.tasks);
  const leadMinutes = useSettingsStore((s) => s.notificationLeadMinutes);
  const summaryTime = useSettingsStore((s) => s.dailySummaryTime);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
    })();
  }, []);

  useEffect(() => {
    const check = () => {
      checkTaskNotifications(tasks, leadMinutes);
      checkMorningSummary(tasks, summaryTime);
    };

    check();
    intervalRef.current = setInterval(check, 60_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tasks, leadMinutes, summaryTime]);
}
