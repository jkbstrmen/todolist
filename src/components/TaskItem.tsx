import type { Task } from '../models/Task';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  subtitle?: string;
  isRemovedView?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${SHORT_DAYS[d.getDay()]}, ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
}

function formatTime(timeStr: string): string {
  return timeStr;
}

export function TaskItem({
  task,
  subtitle,
  isRemovedView,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isRemovedView ? 'removed' : ''}`}>
      <button
        className={isRemovedView ? 'task-restore' : 'task-checkbox'}
        onClick={() => onToggle(task.id)}
        aria-label={isRemovedView ? 'Restore task' : task.completed ? 'Reopen task' : 'Mark complete'}
      >
        {isRemovedView ? '↩' : task.completed ? '✓' : ''}
      </button>
      <div className="task-content" onClick={isRemovedView ? undefined : () => onEdit(task)}>
        <span className="task-title">{task.title}</span>
        {task.description && (
          <span className="task-description">{task.description}</span>
        )}
        <div className="task-meta">
          {subtitle && <span className="task-list-name">{subtitle}</span>}
          {task.dueDate && (
            <span className="task-date">{formatDate(task.dueDate)}</span>
          )}
          {task.dueTime && (
            <span className="task-time">{formatTime(task.dueTime)}</span>
          )}
        </div>
      </div>
      <button
        className="task-delete"
        onClick={() => onDelete(task.id)}
        aria-label={isRemovedView ? 'Delete permanently' : 'Delete task'}
      >
        ×
      </button>
    </div>
  );
}
