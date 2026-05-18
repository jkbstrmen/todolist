import { useState } from 'react';
import './QuickAdd.css';

interface QuickAddProps {
  onAdd: (title: string, description: string, dueDate: string | null, dueTime: string | null) => void;
}

export function QuickAdd({ onAdd }: QuickAddProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const today = new Date().toISOString().split('T')[0];
    onAdd(trimmed, '', today, null);
    setTitle('');
  };

  return (
    <form className="quick-add" onSubmit={handleSubmit}>
      <input
        className="quick-add-input"
        type="text"
        placeholder="Add a task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="quick-add-btn"
        type="submit"
        disabled={!title.trim()}
        aria-label="Add task"
      >
        ↑
      </button>
    </form>
  );
}
