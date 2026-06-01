import { useState, useEffect } from 'react';
import type { Task } from '../models/Task';
import './AddTaskModal.css';

interface AddTaskModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  onClose: () => void;
  onSave: (title: string, description: string, dueDate: string | null, dueTime: string | null) => void;
}

export function AddTaskModal({
  isOpen,
  editingTask,
  onClose,
  onSave,
}: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description ?? '');
      setDueDate(editingTask.dueDate ?? '');
      setDueTime(editingTask.dueTime ?? '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed, description.trim(), dueDate || null, dueTime || null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
        <input
          type="text"
          className="modal-input"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <textarea
          className="modal-input modal-textarea"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="modal-datetime-row">
          <input
            type="date"
            className="modal-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <input
            type="time"
            className="modal-input"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-save"
            disabled={!title.trim()}
            onClick={handleSave}
          >
            {editingTask ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
