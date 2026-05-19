import { useState } from 'react';
import type { TaskList } from '../models/Task';
import { COMPLETED_LIST_ID, REMOVED_LIST_ID } from '../store/useTaskStore';
import './ListSelector.css';

interface ListSelectorProps {
  lists: TaskList[];
  activeListId: string;
  completedCount: number;
  removedCount: number;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function ListSelector({
  lists,
  activeListId,
  completedCount,
  removedCount,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: ListSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const isCompletedView = activeListId === COMPLETED_LIST_ID;
  const isRemovedView = activeListId === REMOVED_LIST_ID;
  const activeName = isRemovedView
    ? 'Removed'
    : isCompletedView
      ? 'Completed'
      : lists.find((l) => l.id === activeListId)?.name;

  const handleCreate = () => {
    const trimmed = newListName.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setNewListName('');
  };

  const startRename = (list: TaskList) => {
    setEditingId(list.id);
    setEditingName(list.name);
  };

  const handleRename = () => {
    if (editingId && editingName.trim()) {
      onRename(editingId, editingName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="list-selector">
      <button
        className="list-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="list-selector-name">{activeName}</span>
        <span className="list-selector-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="list-selector-backdrop"
            onClick={() => setIsOpen(false)}
          />
          <div className="list-selector-dropdown">
            {lists.map((list) => (
              <div
                key={list.id}
                className={`list-option ${list.id === activeListId ? 'active' : ''}`}
              >
                {editingId === list.id ? (
                  <input
                    className="list-rename-input"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <button
                      className="list-option-name"
                      onClick={() => {
                        onSelect(list.id);
                        setIsOpen(false);
                      }}
                    >
                      {list.name}
                    </button>
                    <div className="list-option-actions">
                      <button
                        className="list-action-btn"
                        onClick={() => startRename(list)}
                        aria-label="Rename list"
                      >
                        ✎
                      </button>
                      {lists.length > 1 && (
                        <button
                          className="list-action-btn delete"
                          onClick={() => onDelete(list.id)}
                          aria-label="Delete list"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="list-divider" />

            <div
              className={`list-option completed-option ${isCompletedView ? 'active' : ''}`}
            >
              <button
                className="list-option-name"
                onClick={() => {
                  onSelect(COMPLETED_LIST_ID);
                  setIsOpen(false);
                }}
              >
                ✓ Completed
              </button>
              <span className="completed-badge">{completedCount}</span>
            </div>

            <div
              className={`list-option completed-option ${isRemovedView ? 'active' : ''}`}
            >
              <button
                className="list-option-name"
                onClick={() => {
                  onSelect(REMOVED_LIST_ID);
                  setIsOpen(false);
                }}
              >
                ✗ Removed
              </button>
              <span className="completed-badge">{removedCount}</span>
            </div>

            <div className="list-create">
              <input
                className="list-create-input"
                placeholder="New list..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                }}
              />
              <button
                className="list-create-btn"
                onClick={handleCreate}
                disabled={!newListName.trim()}
              >
                +
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
