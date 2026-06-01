import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { Task } from '../models/Task';

interface AddTaskModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  onClose: () => void;
  onSave: (
    title: string,
    description: string,
    dueDate: string | null,
    dueTime: string | null,
  ) => void;
}

function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

function formatTimeDisplay(timeStr: string): string {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toTimeString(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function AddTaskModal({
  isOpen,
  editingTask,
  onClose,
  onSave,
}: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [dueTime, setDueTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description ?? '');
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(null);
      setDueTime(null);
    }
    setShowDatePicker(false);
    setShowTimePicker(false);
  }, [editingTask, isOpen]);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed, description.trim(), dueDate, dueTime);
    onClose();
  };

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(toDateString(selectedDate));
    }
  };

  const onTimeChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueTime(toTimeString(selectedDate));
    }
  };

  const getDateValue = (): Date => {
    if (dueDate) return new Date(dueDate + 'T00:00:00');
    return new Date();
  };

  const getTimeValue = (): Date => {
    if (dueTime) {
      const d = new Date();
      const [h, m] = dueTime.split(':').map(Number);
      d.setHours(h, m, 0, 0);
      return d;
    }
    return new Date();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.heading}>
              {editingTask ? 'Edit Task' : 'New Task'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Task title"
              placeholderTextColor="#64748b"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor="#64748b"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => {
                  setShowDatePicker(true);
                  setShowTimePicker(false);
                }}
              >
                <Text style={styles.pickerBtnText}>
                  {dueDate ? formatDateDisplay(dueDate) : 'Set date'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => {
                  setShowTimePicker(true);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.pickerBtnText}>
                  {dueTime ? formatTimeDisplay(dueTime) : 'Set time'}
                </Text>
              </TouchableOpacity>
            </View>

            {dueDate && (
              <TouchableOpacity onPress={() => setDueDate(null)}>
                <Text style={styles.clearText}>Clear date</Text>
              </TouchableOpacity>
            )}
            {dueTime && (
              <TouchableOpacity onPress={() => setDueTime(null)}>
                <Text style={styles.clearText}>Clear time</Text>
              </TouchableOpacity>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={getDateValue()}
                mode="date"
                display="default"
                onChange={onDateChange}
                themeVariant="dark"
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={getTimeValue()}
                mode="time"
                display="default"
                onChange={onTimeChange}
                themeVariant="dark"
                is24Hour
              />
            )}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, !title.trim() && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={!title.trim()}
              >
                <Text style={styles.saveText}>
                  {editingTask ? 'Save' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  keyboardView: {
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#273549',
    borderRadius: 16,
    padding: 24,
  },
  heading: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3b4a5e',
  },
  textArea: {
    minHeight: 80,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  pickerBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#3b4a5e',
  },
  pickerBtnText: {
    color: '#94a3b8',
    fontSize: 15,
  },
  clearText: {
    color: '#f87171',
    fontSize: 13,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
