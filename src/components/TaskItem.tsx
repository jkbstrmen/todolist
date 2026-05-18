import type { Task } from '../models/Task';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  subtitle?: string;
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
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function TaskItem({
  task,
  subtitle,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <button
        className="task-checkbox"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Reopen task' : 'Mark complete'}
      >
        {task.completed ? '✓' : ''}
      </button>
      <div className="task-content" onClick={() => onEdit(task)}>
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
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  );
}
