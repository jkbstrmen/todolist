import type { Task } from '../models/Task';
import { useSettingsStore } from '../store/useSettingsStore';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  isCompletedView: boolean;
  isRemovedView: boolean;
  listNameById: (id: string) => string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function getDateSection(dueDate: string | null, noDateOrder: number): { order: number; label: string } {
  if (!dueDate) return { order: noDateOrder, label: 'No date' };

  const today = startOfDay(new Date());
  const due = startOfDay(new Date(dueDate + 'T00:00:00'));
  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { order: -1, label: 'Overdue' };
  if (diffDays === 0) return { order: 0, label: 'Today' };
  if (diffDays === 1) return { order: 1, label: 'Tomorrow' };

  const todayDay = today.getDay();
  const endOfWeekDiff = todayDay === 0 ? 0 : 7 - todayDay;

  if (diffDays <= endOfWeekDiff) {
    return { order: 2 + due.getDay(), label: `This ${DAY_NAMES[due.getDay()]}` };
  }

  if (diffDays <= endOfWeekDiff + 7) {
    return { order: 10, label: 'Next week' };
  }

  const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  if (due <= endOfNextMonth) {
    return { order: 20, label: 'Next month' };
  }

  return { order: 30, label: 'Later' };
}

interface Section {
  order: number;
  label: string;
  tasks: Task[];
}

function sortTasksInSection(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aHasTime = a.dueTime ? 0 : 1;
    const bHasTime = b.dueTime ? 0 : 1;
    if (aHasTime !== bHasTime) return aHasTime - bHasTime;
    if (a.dueTime && b.dueTime) return a.dueTime.localeCompare(b.dueTime);
    return 0;
  });
}

function groupByDate(tasks: Task[], noDateOrder: number): Section[] {
  const map = new Map<string, Section>();

  for (const task of tasks) {
    const { order, label } = getDateSection(task.dueDate, noDateOrder);
    const existing = map.get(label);
    if (existing) {
      existing.tasks.push(task);
    } else {
      map.set(label, { order, label, tasks: [task] });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ ...s, tasks: sortTasksInSection(s.tasks) }));
}

export function TaskList({
  tasks,
  isCompletedView,
  isRemovedView,
  listNameById,
  onToggle,
  onDelete,
  onRestore,
  onPermanentDelete,
  onEdit,
}: TaskListProps) {
  const { noDateTasksPosition } = useSettingsStore();

  if (tasks.length === 0) {
    const emptyText = isRemovedView
      ? 'No removed tasks'
      : isCompletedView
        ? 'No completed tasks'
        : 'No tasks yet';
    return (
      <div className="empty-state">
        <p>{emptyText}</p>
        {!isCompletedView && !isRemovedView && (
          <p className="empty-hint">Type below to add your first task</p>
        )}
      </div>
    );
  }

  if (isRemovedView) {
    return (
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            subtitle={listNameById(task.listId)}
            isRemovedView
            onToggle={onRestore}
            onDelete={onPermanentDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  }

  if (isCompletedView) {
    return (
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            subtitle={listNameById(task.listId)}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  }

  const noDateOrder = noDateTasksPosition === 'beginning' ? -2 : 100;
  const sections = groupByDate(tasks, noDateOrder);

  return (
    <div className="task-list">
      {sections.map((section) => (
        <div key={section.label}>
          <div
            className={`section-header ${section.label === 'Overdue' ? 'section-overdue' : ''}`}
          >
            {section.label}
            <span className="section-count">{section.tasks.length}</span>
          </div>
          {section.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
