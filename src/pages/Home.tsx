import { useState, useRef } from 'react';
import { useTaskStore, COMPLETED_LIST_ID } from '../store/useTaskStore';
import { TaskList } from '../components/TaskList';
import { AddTaskModal } from '../components/AddTaskModal';
import { ListSelector } from '../components/ListSelector';
import { QuickAdd } from '../components/QuickAdd';
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
  } = useTaskStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const isCompletedView = activeListId === COMPLETED_LIST_ID;

  const filteredTasks = isCompletedView
    ? tasks.filter((t) => t.completed)
    : tasks.filter((t) => t.listId === activeListId && !t.completed);

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

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="home">
      <header className="home-header">
        <ListSelector
          lists={lists}
          activeListId={activeListId}
          completedCount={completedCount}
          onSelect={setActiveList}
          onCreate={addList}
          onRename={renameList}
          onDelete={deleteList}
        />
        <div className="header-right">
          <span className="task-count">
            {isCompletedView
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
                  <p className="menu-empty">No options yet</p>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="home-content">
        <TaskList
          tasks={filteredTasks}
          isCompletedView={isCompletedView}
          listNameById={listNameById}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={handleEdit}
        />
      </main>
      {!isCompletedView && (
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
