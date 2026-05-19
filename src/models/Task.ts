export interface TaskList {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  removed?: boolean;
  dueDate: string | null;
  dueTime: string | null;
  listId: string;
  createdAt: string;
}
