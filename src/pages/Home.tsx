import { useState, useRef } from 'react';
import { useTaskStore, COMPLETED_LIST_ID, REMOVED_LIST_ID } from '../store/useTaskStore';
import { TaskList } from '../components/TaskList';
import { AddTaskModal } from '../components/AddTaskModal';
import { ListSelector } from '../components/ListSelector';
import { QuickAdd } from '../components/QuickAdd';
import { SettingsPane } from '../components/SettingsPane';
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
  } = useTaskStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
                        onClick={() => {
                          setSettingsOpen(true);
                          setMenuOpen(false);
                        }}
                      >
                        Settings
                      </button>
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
            onToggle={toggleTask}
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
    </div>
  );
}
