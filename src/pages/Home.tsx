import { useState, useRef, useCallback } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTaskStore, COMPLETED_LIST_ID, REMOVED_LIST_ID } from '../store/useTaskStore';
import { TaskList } from '../components/TaskList';
import { AddTaskModal } from '../components/AddTaskModal';
import { ListSelector } from '../components/ListSelector';
import { QuickAdd } from '../components/QuickAdd';
import { SettingsPane } from '../components/SettingsPane';
import { UndoSnackbar } from '../components/UndoSnackbar';
import type { Task } from '../models/Task';
import './Home.css';

export function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    lists,
    activeListId,
    tasks,
    addList,
    renameList,
    deleteList,
    setActiveList,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    restoreTask,
    permanentDeleteTask,
    importData,
  } = useTaskStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [undoTask, setUndoTask] = useState<Task | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const handleToggle = useCallback((id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      // Completing a task — show undo snackbar
      setUndoTask(task);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    }
    toggleTask(id);
  }, [tasks, toggleTask]);

  const handleUndo = useCallback(() => {
    if (undoTask) {
      toggleTask(undoTask.id);
      setUndoTask(null);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    }
  }, [undoTask, toggleTask]);

  const dismissUndo = useCallback(() => {
    setUndoTask(null);
  }, []);

  const handleExport = useCallback(() => {
    const settings = useSettingsStore.getState();
    const { noDateTasksPosition, quickAddDate, notificationLeadMinutes, dailySummaryTime } = settings;
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      lists,
      tasks,
      settings: { noDateTasksPosition, quickAddDate, notificationLeadMinutes, dailySummaryTime },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todolist-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  }, [lists, tasks]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
    setMenuOpen(false);
  }, []);

  const handleFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.lists || !data.tasks) {
          alert('Invalid file: missing lists or tasks');
          return;
        }
        importData(data.lists, data.tasks);
        if (data.settings) {
          const { updateSetting } = useSettingsStore.getState();
          const s = data.settings;
          if (s.noDateTasksPosition) updateSetting('noDateTasksPosition', s.noDateTasksPosition);
          if (s.quickAddDate) updateSetting('quickAddDate', s.quickAddDate);
          if (s.notificationLeadMinutes != null) updateSetting('notificationLeadMinutes', s.notificationLeadMinutes);
          if (s.dailySummaryTime) updateSetting('dailySummaryTime', s.dailySummaryTime);
        }
      } catch {
        alert('Failed to parse file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [importData]);

  const isCompletedView = activeListId === COMPLETED_LIST_ID;
  const isRemovedView = activeListId === REMOVED_LIST_ID;

  const filteredTasks = isRemovedView
    ? tasks.filter((t) => t.removed)
    : isCompletedView
      ? tasks.filter((t) => t.completed && !t.removed)
      : tasks.filter((t) => t.listId === activeListId && !t.completed && !t.removed);

  const listNameById = (id: string) =>
    lists.find((l) => l.id === id)?.name ?? 'Unknown';

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = (title: string, description: string, dueDate: string | null, dueTime: string | null) => {
    if (editingTask) {
      editTask(editingTask.id, title, description, dueDate, dueTime);
    } else {
      addTask(title, description, dueDate, dueTime);
    }
  };

  const completedCount = tasks.filter((t) => t.completed && !t.removed).length;
  const removedCount = tasks.filter((t) => t.removed).length;

  return (
    <div className="home">
      <header className="home-header">
        {settingsOpen ? (
          <button
            className="back-btn"
            onClick={() => setSettingsOpen(false)}
          >
            ← Settings
          </button>
        ) : (
          <>
            <ListSelector
              lists={lists}
              activeListId={activeListId}
              completedCount={completedCount}
              removedCount={removedCount}
              onSelect={setActiveList}
              onCreate={addList}
              onRename={renameList}
              onDelete={deleteList}
            />
            <div className="header-right">
              <span className="task-count">
                {isRemovedView
                  ? `${filteredTasks.length} removed`
                  : isCompletedView
                    ? `${filteredTasks.length} completed`
                    : `${filteredTasks.length} pending`}
              </span>
              <div className="menu-wrapper" ref={menuRef}>
                <button
                  className="menu-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Menu"
                >
                  ⋮
                </button>
                {menuOpen && (
                  <>
                    <div
                      className="menu-backdrop"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="menu-dropdown">
                      <button
                        className="menu-item"
                        onClick={handleExport}
                      >
                        Export
                      </button>
                      <button
                        className="menu-item"
                        onClick={handleImport}
                      >
                        Import
                      </button>
                      <div className="menu-divider" />
                      <button
                        className="menu-item"
                        onClick={() => {
                          setSettingsOpen(true);
                          setMenuOpen(false);
                        }}
                      >
                        Settings
                      </button>
                      <div className="menu-divider" />
                      <span className="menu-version">v{APP_VERSION}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </header>
      <main className="home-content">
        {settingsOpen ? (
          <SettingsPane />
        ) : (
          <TaskList
            tasks={filteredTasks}
            isCompletedView={isCompletedView}
            isRemovedView={isRemovedView}
            listNameById={listNameById}
            onToggle={handleToggle}
            onDelete={deleteTask}
            onRestore={restoreTask}
            onPermanentDelete={permanentDeleteTask}
            onEdit={handleEdit}
          />
        )}
      </main>
      {!isCompletedView && !isRemovedView && !settingsOpen && (
        <>
          <button
            className="fab"
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
            aria-label="Add task with details"
          >
            +
          </button>
          <QuickAdd onAdd={addTask} />
        </>
      )}
      <AddTaskModal
        isOpen={modalOpen}
        editingTask={editingTask}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
      {undoTask && (
        <UndoSnackbar
          message={`"${undoTask.title}" completed`}
          onUndo={handleUndo}
          onDismiss={dismissUndo}
        />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
    </div>
  );
}
