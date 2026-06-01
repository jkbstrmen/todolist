import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Task } from '../models/Task';

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
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
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
    <View style={[styles.container, task.completed && styles.completed]}>
      <TouchableOpacity
        style={[styles.checkbox, isRemovedView && styles.restoreBtn]}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.checkboxText}>
          {isRemovedView ? '↩' : task.completed ? '✓' : ''}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.content}
        onPress={isRemovedView ? undefined : () => onEdit(task)}
        activeOpacity={isRemovedView ? 1 : 0.7}
      >
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}
        <View style={styles.meta}>
          {subtitle ? (
            <Text style={styles.listName}>{subtitle}</Text>
          ) : null}
          {task.dueDate ? (
            <View style={styles.datePill}>
              <Text style={styles.dateText}>{formatDate(task.dueDate)}</Text>
            </View>
          ) : null}
          {task.dueTime ? (
            <Text style={styles.timeText}>{formatTime(task.dueTime)}</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(task.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3b4a5e',
  },
  completed: {
    opacity: 0.6,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  restoreBtn: {
    borderColor: '#10b981',
  },
  checkboxText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#e2e8f0',
    fontSize: 16,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  description: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  listName: {
    color: '#94a3b8',
    fontSize: 12,
  },
  datePill: {
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dateText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  timeText: {
    color: '#60a5fa',
    fontSize: 12,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 4,
  },
  deleteText: {
    color: '#94a3b8',
    fontSize: 22,
    lineHeight: 22,
  },
});
