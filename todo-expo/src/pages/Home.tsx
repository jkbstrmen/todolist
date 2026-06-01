import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore, COMPLETED_LIST_ID, REMOVED_LIST_ID } from '../store/useTaskStore';
import { TaskList } from '../components/TaskList';
import { AddTaskModal } from '../components/AddTaskModal';
import { ListSelector } from '../components/ListSelector';
import { QuickAdd } from '../components/QuickAdd';
import { SettingsPane } from '../components/SettingsPane';
import type { Task } from '../models/Task';

export function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleSave = (
    title: string,
    description: string,
    dueDate: string | null,
    dueTime: string | null,
  ) => {
    if (editingTask) {
      editTask(editingTask.id, title, description, dueDate, dueTime);
    } else {
      addTask(title, description, dueDate, dueTime);
    }
  };

  const completedCount = tasks.filter((t) => t.completed && !t.removed).length;
  const removedCount = tasks.filter((t) => t.removed).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          {settingsOpen ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setSettingsOpen(false)}
            >
              <Text style={styles.backText}>← Settings</Text>
            </TouchableOpacity>
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
              <View style={styles.headerRight}>
                <Text style={styles.taskCount}>
                  {isRemovedView
                    ? `${filteredTasks.length} removed`
                    : isCompletedView
                      ? `${filteredTasks.length} completed`
                      : `${filteredTasks.length} pending`}
                </Text>
                <TouchableOpacity
                  style={styles.menuBtn}
                  onPress={() => setMenuOpen(!menuOpen)}
                >
                  <Text style={styles.menuIcon}>⋮</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {menuOpen && (
          <>
            <TouchableOpacity
              style={styles.menuBackdrop}
              activeOpacity={1}
              onPress={() => setMenuOpen(false)}
            />
            <View style={styles.menuDropdown}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setSettingsOpen(true);
                  setMenuOpen(false);
                }}
              >
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.content}>
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
        </View>

        {!isCompletedView && !isRemovedView && !settingsOpen && (
          <>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => {
                setEditingTask(null);
                setModalOpen(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
            <QuickAdd onAdd={addTask} />
          </>
        )}

        <AddTaskModal
          isOpen={modalOpen}
          editingTask={editingTask}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#273549',
  },
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#273549',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3b4a5e',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskCount: {
    color: '#94a3b8',
    fontSize: 13,
  },
  menuBtn: {
    padding: 4,
  },
  menuIcon: {
    color: '#e2e8f0',
    fontSize: 22,
    fontWeight: '700',
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#273549',
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 160,
    zIndex: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    color: '#e2e8f0',
    fontSize: 15,
  },
  backBtn: {
    paddingVertical: 4,
  },
  backText: {
    color: '#60a5fa',
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
});
