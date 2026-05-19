export interface Settings {
  noDateTasksPosition: 'beginning' | 'end';
  quickAddDate: 'today' | 'none';
  notificationLeadMinutes: number;
  dailySummaryTime: string;
}

export const DEFAULT_SETTINGS: Settings = {
  noDateTasksPosition: 'end',
  quickAddDate: 'today',
  notificationLeadMinutes: 15,
  dailySummaryTime: '07:00',
};
