import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { TaskList } from '../models/Task';
import { COMPLETED_LIST_ID, REMOVED_LIST_ID } from '../store/useTaskStore';

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
    <View>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerName}>{activeName}</Text>
        <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <View style={styles.dropdown}>
            <ScrollView>
              {lists.map((list) => (
                <View
                  key={list.id}
                  style={[
                    styles.option,
                    list.id === activeListId && styles.optionActive,
                  ]}
                >
                  {editingId === list.id ? (
                    <TextInput
                      style={styles.renameInput}
                      value={editingName}
                      onChangeText={setEditingName}
                      onBlur={handleRename}
                      onSubmitEditing={handleRename}
                      autoFocus
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.optionNameBtn}
                        onPress={() => {
                          onSelect(list.id);
                          setIsOpen(false);
                        }}
                      >
                        <Text style={styles.optionName}>{list.name}</Text>
                      </TouchableOpacity>
                      <View style={styles.optionActions}>
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => startRename(list)}
                        >
                          <Text style={styles.actionText}>✎</Text>
                        </TouchableOpacity>
                        {lists.length > 1 && (
                          <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => onDelete(list.id)}
                          >
                            <Text style={[styles.actionText, styles.deleteAction]}>
                              ×
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
                </View>
              ))}

              <View style={styles.divider} />

              <TouchableOpacity
                style={[
                  styles.option,
                  isCompletedView && styles.optionActive,
                ]}
                onPress={() => {
                  onSelect(COMPLETED_LIST_ID);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.optionName}>✓ Completed</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{completedCount}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  isRemovedView && styles.optionActive,
                ]}
                onPress={() => {
                  onSelect(REMOVED_LIST_ID);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.optionName}>✗ Removed</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{removedCount}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <View style={styles.createRow}>
                <TextInput
                  style={styles.createInput}
                  placeholder="New list..."
                  placeholderTextColor="#64748b"
                  value={newListName}
                  onChangeText={setNewListName}
                  onSubmitEditing={handleCreate}
                />
                <TouchableOpacity
                  style={[
                    styles.createBtn,
                    !newListName.trim() && styles.createBtnDisabled,
                  ]}
                  onPress={handleCreate}
                  disabled={!newListName.trim()}
                >
                  <Text style={styles.createBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  triggerName: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '700',
  },
  arrow: {
    color: '#94a3b8',
    fontSize: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  dropdown: {
    backgroundColor: '#273549',
    borderRadius: 12,
    maxHeight: 400,
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionActive: {
    backgroundColor: '#1e293b',
  },
  optionNameBtn: {
    flex: 1,
  },
  optionName: {
    color: '#e2e8f0',
    fontSize: 16,
  },
  optionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 4,
  },
  actionText: {
    color: '#94a3b8',
    fontSize: 18,
  },
  deleteAction: {
    color: '#f87171',
  },
  renameInput: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 16,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#3b4a5e',
    marginVertical: 4,
  },
  badge: {
    backgroundColor: '#3b4a5e',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  badgeText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  createInput: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 15,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#3b4a5e',
  },
  createBtn: {
    backgroundColor: '#3b82f6',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnDisabled: {
    opacity: 0.4,
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
});
