import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useSettingsStore } from '../store/useSettingsStore';

export function SettingsPane() {
  const {
    noDateTasksPosition,
    quickAddDate,
    notificationLeadMinutes,
    dailySummaryTime,
    updateSetting,
  } = useSettingsStore();

  const [showTimePicker, setShowTimePicker] = useState(false);

  const leadOptions = [0, 5, 10, 15, 30, 60];

  const onTimeChange = (_event: DateTimePickerEvent, date?: Date) => {
    setShowTimePicker(false);
    if (date) {
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      updateSetting('dailySummaryTime', `${h}:${m}`);
    }
  };

  const getSummaryDate = (): Date => {
    const [h, m] = dailySummaryTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const formatTime12 = (timeStr: string): string => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>Task Display</Text>

      <View style={styles.item}>
        <View style={styles.itemText}>
          <Text style={styles.label}>Tasks without date</Text>
          <Text style={styles.hint}>Where undated tasks appear in the list</Text>
        </View>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              noDateTasksPosition === 'beginning' && styles.toggleActive,
            ]}
            onPress={() => updateSetting('noDateTasksPosition', 'beginning')}
          >
            <Text
              style={[
                styles.toggleText,
                noDateTasksPosition === 'beginning' && styles.toggleTextActive,
              ]}
            >
              Top
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              noDateTasksPosition === 'end' && styles.toggleActive,
            ]}
            onPress={() => updateSetting('noDateTasksPosition', 'end')}
          >
            <Text
              style={[
                styles.toggleText,
                noDateTasksPosition === 'end' && styles.toggleTextActive,
              ]}
            >
              Bottom
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.item}>
        <View style={styles.itemText}>
          <Text style={styles.label}>Quick add default date</Text>
          <Text style={styles.hint}>Date assigned when using quick add</Text>
        </View>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              quickAddDate === 'today' && styles.toggleActive,
            ]}
            onPress={() => updateSetting('quickAddDate', 'today')}
          >
            <Text
              style={[
                styles.toggleText,
                quickAddDate === 'today' && styles.toggleTextActive,
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              quickAddDate === 'none' && styles.toggleActive,
            ]}
            onPress={() => updateSetting('quickAddDate', 'none')}
          >
            <Text
              style={[
                styles.toggleText,
                quickAddDate === 'none' && styles.toggleTextActive,
              ]}
            >
              None
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.groupTitle, { marginTop: 24 }]}>Notifications</Text>

      <View style={styles.item}>
        <View style={styles.itemText}>
          <Text style={styles.label}>Reminder lead time</Text>
          <Text style={styles.hint}>Minutes before a task to send reminder</Text>
        </View>
        <View style={styles.chipRow}>
          {leadOptions.map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.chip,
                notificationLeadMinutes === val && styles.chipActive,
              ]}
              onPress={() => updateSetting('notificationLeadMinutes', val)}
            >
              <Text
                style={[
                  styles.chipText,
                  notificationLeadMinutes === val && styles.chipTextActive,
                ]}
              >
                {val}m
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.item}>
        <View style={styles.itemText}>
          <Text style={styles.label}>Daily summary time</Text>
          <Text style={styles.hint}>When to show the daily task summary</Text>
        </View>
        <TouchableOpacity
          style={styles.timeBtn}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeBtnText}>
            {formatTime12(dailySummaryTime)}
          </Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={getSummaryDate()}
          mode="time"
          display="default"
          onChange={onTimeChange}
          themeVariant="dark"
          is24Hour
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  groupTitle: {
    color: '#60a5fa',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  item: {
    marginBottom: 20,
  },
  itemText: {
    marginBottom: 8,
  },
  label: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '500',
  },
  hint: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#3b4a5e',
  },
  toggleActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  toggleText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#3b4a5e',
  },
  chipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  chipText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  timeBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3b4a5e',
    alignSelf: 'flex-start',
  },
  timeBtnText: {
    color: '#e2e8f0',
    fontSize: 15,
  },
});
