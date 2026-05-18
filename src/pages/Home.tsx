import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskList } from '../components/TaskList';
import { AddTaskModal } from '../components/AddTaskModal';
import type { Task } from '../models/Task';
import './Home.css';

export function Home() {
  const { tasks, addTask, toggleTask, editTask, deleteTask } = useTaskStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAdd = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = (title: string, dueDate: string | null) => {
    if (editingTask) {
      editTask(editingTask.id, title, dueDate);
    } else {
      addTask(title, dueDate);
    }
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1>TODO List</h1>
        <span className="task-count">
          {tasks.filter((t) => !t.completed).length} pending
        </span>
      </header>
      <main className="home-content">
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={handleEdit}
        />
      </main>
      <button className="fab" onClick={handleAdd} aria-label="Add task">
        +
      </button>
      <AddTaskModal
        isOpen={modalOpen}
        editingTask={editingTask}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
