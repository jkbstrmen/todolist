import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface QuickAddProps {
  onAdd: (title: string, description: string, dueDate: string | null, dueTime: string | null) => void;
}

export function QuickAdd({ onAdd }: QuickAddProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const today = new Date().toISOString().split('T')[0];
    onAdd(trimmed, '', today, null);
    setTitle('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a task..."
        placeholderTextColor="#64748b"
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleSubmit}
        returnKeyType="send"
      />
      <TouchableOpacity
        style={[styles.btn, !title.trim() && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={!title.trim()}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>↑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#273549',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#3b4a5e',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#3b4a5e',
  },
  btn: {
    backgroundColor: '#3b82f6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
});
