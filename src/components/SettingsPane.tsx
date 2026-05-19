import { useSettingsStore } from '../store/useSettingsStore';
import './SettingsPane.css';

export function SettingsPane() {
  const {
    noDateTasksPosition,
    quickAddDate,
    notificationLeadMinutes,
    dailySummaryTime,
    updateSetting,
  } = useSettingsStore();

  return (
    <div className="settings-pane">
      <div className="settings-group">
        <h3 className="settings-group-title">Task Display</h3>

        <div className="settings-item">
          <div className="settings-item-text">
            <label>Tasks without date</label>
            <p>Where undated tasks appear in the list</p>
          </div>
          <select
            className="settings-select"
            value={noDateTasksPosition}
            onChange={(e) =>
              updateSetting(
                'noDateTasksPosition',
                e.target.value as 'beginning' | 'end',
              )
            }
          >
            <option value="beginning">Beginning</option>
            <option value="end">End</option>
          </select>
        </div>

        <div className="settings-item">
          <div className="settings-item-text">
            <label>Quick add default date</label>
            <p>Date assigned when using quick add</p>
          </div>
          <select
            className="settings-select"
            value={quickAddDate}
            onChange={(e) =>
              updateSetting('quickAddDate', e.target.value as 'today' | 'none')
            }
          >
            <option value="today">Today</option>
            <option value="none">No date</option>
          </select>
        </div>
      </div>

      <div className="settings-group">
        <h3 className="settings-group-title">Notifications</h3>

        <div className="settings-item">
          <div className="settings-item-text">
            <label>Reminder lead time</label>
            <p>Minutes before a task to send reminder</p>
          </div>
          <input
            type="number"
            className="settings-number"
            value={notificationLeadMinutes}
            min={0}
            max={120}
            step={5}
            inputMode="numeric"
            onChange={(e) => {
              const val = Math.max(0, Math.min(120, parseInt(e.target.value) || 0));
              updateSetting('notificationLeadMinutes', val);
            }}
          />
        </div>

        <div className="settings-item">
          <div className="settings-item-text">
            <label>Daily summary time</label>
            <p>When to show the daily task summary</p>
          </div>
          <input
            type="time"
            className="settings-time"
            value={dailySummaryTime}
            onChange={(e) => updateSetting('dailySummaryTime', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
